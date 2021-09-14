import { FC } from "react";
import { MenuItem } from "../api";

interface MostOrderedItemProps {
  item: MenuItem;
}

const MenuItemComponent: FC<MostOrderedItemProps> = ({ item }) => {
  return (
    <div className="menu-item most-ordered">
      <div className="name">{item.name}</div>
    </div>
  );
};

export default MenuItemComponent;
