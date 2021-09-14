import React, { FC } from "react";
import { MenuItem } from "../api";

interface MenuItemProps {
  item: MenuItem;
  changeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
}

const MenuItemComponent: FC<MenuItemProps> = ({ item, changeHandler }) => {
  return (
    <div className="menu-item">
      <div className="name">{item.name}</div>
      <div className="price">R$ {item.value}</div>
      <div className="selector">
        <input
          onChange={(e) => changeHandler(e)}
          value={item.count}
          id={item._id}
          type="number"
          min="0"
        ></input>
      </div>
    </div>
  );
};

export default MenuItemComponent;
