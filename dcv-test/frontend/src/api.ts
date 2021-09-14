import axios from "axios";

const dcvClient = axios.create({
  baseURL: "http://localhost:3000",
});

export interface MenuItem {
  _id: string;
  name: string;
  value: number;
  type: string;
  count: number;
}

export interface OrderSheet {
  _id: string;
  state: string;
  customerName: string;
  orderSum: number;
  items: {
    id: string;
    qty: number;
    value: number;
    name: string;
  }[];
}

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const response = await dcvClient.get<MenuItem[]>("menu/items");
  return response.data.map((x) => {
    x.count = 0;
    return x;
  });
};

export const getMostOrderedItems = async (): Promise<MenuItem[]> => {
  const response = await dcvClient.get<MenuItem[]>("menu/items/most-ordered");
  return response.data.map((x) => {
    x.count = 0;
    return x;
  });
};

export const createOrder = async (
  customerName: string,
  orderItems: MenuItem[]
): Promise<OrderSheet> => {
  const mappedItems = orderItems.flatMap((item) => {
    if (item.count === 0) return [];

    return {
      id: item._id,
      qty: item.count,
    };
  });

  const response = await dcvClient.post<OrderSheet>("order-sheets/create", {
    customerName,
    items: mappedItems,
  });

  return response.data;
};

export const getOrderSheets = async (): Promise<OrderSheet[]> => {
  const response = await dcvClient.get<OrderSheet[]>("order-sheets");
  return response.data;
};

export const changeOrderSheetToReady = async (
  orderSheetId: string
): Promise<OrderSheet> => {
  const response = await dcvClient.post<OrderSheet>(
    "order-sheets/change-to-ready",
    { id: orderSheetId }
  );
  return response.data;
};

interface PaymentInput {
  method: string;
  value?: number | undefined;
}

export const checkout = async (
  orderSheetId: string,
  paymentInput: PaymentInput
): Promise<OrderSheet> => {
  const response = await dcvClient.post<OrderSheet>("order-sheets/checkout", {
    id: orderSheetId,
    paymentInput,
  });
  return response.data;
};
