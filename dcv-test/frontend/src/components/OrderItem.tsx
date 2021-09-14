import { FC } from "react";

interface OrderItem {
  id: string;
  qty: number;
  value: number;
  name: string;
}

interface OrderItemProps {
  item: OrderItem;
}

const OrderItemComponent: FC<OrderItemProps> = ({ item }) => {
  return (
    <div className="menu-item order">
      <div className="name">
        {item.name} ({item.qty})
      </div>
      <div className="price">R$ {item.value * item.qty}</div>
    </div>
  );
};

export default OrderItemComponent;
