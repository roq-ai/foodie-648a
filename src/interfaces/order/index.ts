import { DeliveryInterface } from 'interfaces/delivery';
import { OrderItemInterface } from 'interfaces/order-item';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface OrderInterface {
  id?: string;
  user_id: string;
  delivery_address?: string;
  total_price?: number;
  status?: string;
  order_date?: any;
  delivery_date?: any;
  created_at?: any;
  updated_at?: any;
  delivery?: DeliveryInterface[];
  order_item?: OrderItemInterface[];
  user?: UserInterface;
  _count?: {
    delivery?: number;
    order_item?: number;
  };
}

export interface OrderGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  delivery_address?: string;
  status?: string;
}
