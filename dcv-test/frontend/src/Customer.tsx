import { useEffect, useState, Fragment, useRef } from "react";
import {
  MenuItem,
  OrderSheet,
  getMenuItems,
  getMostOrderedItems,
  createOrder,
  checkout,
} from "./api";

import Select from "react-select";

import MenuItemCp from "./components/MenuItem";
import MostOrderedItemCp from "./components/MostOrderedItem";
import OrderItemCp from "./components/OrderItem";

interface OrderSheetEvent {
  event: string;
  order: OrderSheet;
}

interface MyOption {
  value: string;
  label: string;
}

function Customer() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [mostOrderedItems, setMostOrderedItems] = useState<MenuItem[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [renderOrderSheet, setRenderOrderSheetState] = useState<boolean>(false);
  const [orderSheet, setOrderSheetState] = useState<OrderSheet>();
  const [paymentMethod, setPaymentMethod] = useState<string>();
  const [cashValue, setCashValue] = useState<number>();
  const orderSheetRef = useRef(orderSheet);

  const paymentOptions = [
    { value: "DEBIT", label: "Débito" },
    { value: "CREDIT", label: "Crédito" },
    { value: "CASH", label: "Dinheiro" },
  ];

  const paymentMethodHandler = (selected?: MyOption | null) => {
    if (selected) {
      setPaymentMethod(selected.value);
    }
  };

  const changeCashHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setCashValue(+e.currentTarget.value);
  };

  const finishOrderHandler = async (method?: string, cashValue?: number) => {
    const id = orderSheetRef.current?._id;

    if (id && method === "CASH" && cashValue) {
      const paymentInput = { method, value: cashValue };
      await checkout(id, paymentInput);
      return;
    }

    if (id && method) {
      const paymentInput = { method };
      await checkout(id, paymentInput);
    }
  };

  const parseOrderState = (state?: string) => {
    switch (state) {
      case "PREPARING":
        return "Em preparo";
      case "READY":
        return "Entregue";
      case "FINISHED":
        return "Concluído";
      default:
        return "";
    }
  };

  const processEvent = (event: OrderSheetEvent) => {
    if (
      event.event === "orderSheet.updated" &&
      event.order._id === orderSheetRef.current?._id
    ) {
      setOrderSheetState(event.order);
    }
  };

  useEffect(() => {
    (async function () {
      const menuItemsResponse = await getMenuItems();
      const mostOrderedItemsResponse = await getMostOrderedItems();

      setMostOrderedItems(mostOrderedItemsResponse);
      setMenuItems(menuItemsResponse);
    })();
  }, []);

  const customerNameHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setCustomerName(e.currentTarget.value);
  };

  const itemChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const newCountValue = +e.currentTarget.value;
    const itemId = e.currentTarget.id;

    const newState = menuItems.map((i) => {
      if (i._id !== itemId) return i;
      i.count = newCountValue;
      return i;
    });

    setMenuItems(newState);
  };

  const createOrderHandler = async () => {
    if (!customerName) {
      alert("Por favor insira um nome para prosseguir");
      return;
    }

    if (customerName.length < 2 || customerName.length > 20) {
      alert(
        "Por favor insira um nome válido para prosseguir: minimo de 2 caractéres e máximo de 20."
      );
      return;
    }

    try {
      const orderSheet = await createOrder(customerName, menuItems);
      setOrderSheetState(orderSheet);
      orderSheetRef.current = orderSheet;
      setRenderOrderSheetState(true);

      const source = new EventSource(
        "http://localhost:3000/order-sheets/events"
      );

      source.onerror = () =>
        console.log("An error has occurred while receiving order sheet events");

      source.onmessage = (payload) => {
        const event = JSON.parse(payload.data);
        processEvent(event);
      };
    } catch (err) {
      alert("Não foi possível fazer o seu pedido, por favor tente novamente.");
      console.log("error", err);
    }
  };

  const shouldRenderOrderSheet = () => {
    if (!renderOrderSheet) {
      return (
        <div className="customer-wrapper">
          <div className="most-ordered">
            <p>
              <b>MAIS PEDIDOS</b>
            </p>
            {mostOrderedItems.length > 0
              ? mostOrderedItems.map((item) => {
                  return <MostOrderedItemCp key={item._id} item={item} />;
                })
              : "carregando mais pedidos..."}
          </div>

          <div>
            <p>
              <b>MENU</b>
            </p>
            {menuItems.length > 0
              ? menuItems.map((item) => {
                  return (
                    <MenuItemCp
                      key={item._id}
                      item={item}
                      changeHandler={itemChangeHandler}
                    />
                  );
                })
              : "carregando menu..."}
          </div>
          <div className="checkout">
            <div className="customer">
              <label>NOME DO CLIENTE</label>
              <div className="customer-input">
                <input
                  type="text"
                  onChange={customerNameHandler}
                  value={customerName}
                />
              </div>
            </div>
            <div className="btn">
              <button onClick={createOrderHandler}>CRIAR PEDIDO</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="customer-wrapper">
        <div>
          <div className="order-sheet-header">
            <p className="info">
              Comanda De: <b className="upper">{orderSheet?.customerName}</b> (
              {orderSheet?._id})
            </p>
            <p className="state">
              <b className="upper">{parseOrderState(orderSheet?.state)}</b>
            </p>
          </div>
          {orderSheet?.items.map((item) => {
            return <OrderItemCp key={item.id} item={item} />;
          })}
          <div className="menu-item order total">
            <div>
              <b>TOTAL</b>
            </div>
            <div className="price">R$ {orderSheet?.orderSum}</div>
          </div>
        </div>

        {orderSheet.state === "READY" ? (
          <div className="checkout payment">
            <div className="payment-method">
              <Select
                placeholder="Forma de pagamento"
                onChange={paymentMethodHandler}
                options={paymentOptions}
              />
            </div>
            <div className="payment-value">
              {paymentMethod === "cash" ? (
                <input onChange={changeCashHandler} type="number" min="0" />
              ) : null}
            </div>
            <div className="btn">
              <button
                onClick={() => finishOrderHandler(paymentMethod, cashValue)}
              >
                ENCERRAR PEDIDO
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return <Fragment>{shouldRenderOrderSheet()}</Fragment>;
}

export default Customer;
