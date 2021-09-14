import { useEffect, useState } from "react";
import OrderSheetCp from "./components/OrderSheet";
import { OrderSheet, getOrderSheets, changeOrderSheetToReady } from "./api";

interface OrderSheetEvent {
  event: string;
  order: OrderSheet;
}

function Kitchen() {
  const [orderSheets, setOrderSheetsState] = useState<OrderSheet[]>([]);

  const processEvent = (event: OrderSheetEvent) => {
    if (event.event === "orderSheet.created") {
      setOrderSheetsState((prevState) => {
        const newState = [event.order, ...prevState];
        return newState;
      });
    }

    if (event.event === "orderSheet.updated") {
      setOrderSheetsState((prevState) => {
        const newState = prevState.map((os) => {
          if (os._id !== event.order._id) return os;
          return event.order;
        });
        return newState;
      });
    }
  };

  const changeToReadyHandler = async (orderSheetId: string) => {
    try {
      await changeOrderSheetToReady(orderSheetId);

      const newState = orderSheets.map((o) => {
        if (o._id !== orderSheetId) return o;
        o.state = "READY";
        return o;
      });

      setOrderSheetsState(newState);
    } catch (err) {
      alert("não foi possível alterar o estado da comanda");
    }
  };

  useEffect(() => {
    const source = new EventSource("http://localhost:3000/order-sheets/events");

    source.onerror = () =>
      console.log("An error has occurred while receiving order sheet events");

    source.onmessage = (payload) => {
      const event = JSON.parse(payload.data);
      processEvent(event);
    };

    (async function () {
      const orderSheetsResponse = await getOrderSheets();
      console.log(orderSheetsResponse);
      setOrderSheetsState(orderSheetsResponse);
    })();
  }, []);

  return (
    <div className="kitchen-wrapper">
      <p className="header">
        <b>COMANDAS ATIVAS</b>
      </p>
      <div className="kitchen-orders-grid">
        {orderSheets.map((os) => {
          return (
            <OrderSheetCp
              key={os._id}
              orderSheet={os}
              changeToReadyHandler={changeToReadyHandler}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Kitchen;
