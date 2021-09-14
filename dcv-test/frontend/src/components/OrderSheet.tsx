import { FC } from "react";
import { OrderSheet } from "../api";

import OrderItemCp from "./OrderItem";

interface OrderSheetProps {
  orderSheet: OrderSheet;
  changeToReadyHandler: (orderSheetId: string) => Promise<void>;
}

const OrderSheetCompoment: FC<OrderSheetProps> = ({
  orderSheet,
  changeToReadyHandler,
}) => {
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
        {orderSheet?.items?.map((item) => {
          return <OrderItemCp key={item.id} item={item} />;
        })}
        <div className="menu-item order total">
          <div>
            <b>TOTAL</b>
          </div>
          <div className="price">R$ {orderSheet?.orderSum}</div>
        </div>
      </div>
      {orderSheet?.state === "PREPARING" ? (
        <div className="state-changer">
          <button onClick={() => changeToReadyHandler(orderSheet?._id)}>
            Alterar Para Entregue
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default OrderSheetCompoment;
