import { OrderItemInterface } from 'interfaces/order-item';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface MenuInterface {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  organization_id: string;
  availability?: boolean;
  created_at?: any;
  updated_at?: any;
  order_item?: OrderItemInterface[];
  organization?: OrganizationInterface;
  _count?: {
    order_item?: number;
  };
}

export interface MenuGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  category?: string;
  organization_id?: string;
}
