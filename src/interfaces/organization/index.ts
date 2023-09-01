import { MenuInterface } from 'interfaces/menu';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface OrganizationInterface {
  id?: string;
  description?: string;
  location?: string;
  operation_hours?: string;
  rating?: number;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  menu?: MenuInterface[];
  user?: UserInterface;
  _count?: {
    menu?: number;
  };
}

export interface OrganizationGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  location?: string;
  operation_hours?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
