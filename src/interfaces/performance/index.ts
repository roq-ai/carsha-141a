import { VehicleInterface } from 'interfaces/vehicle';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PerformanceInterface {
  id?: string;
  vehicle_id: string;
  date: any;
  usage_rate: number;
  demand_rate: number;
  analyst_id: string;
  created_at?: any;
  updated_at?: any;

  vehicle?: VehicleInterface;
  user?: UserInterface;
  _count?: {};
}

export interface PerformanceGetQueryInterface extends GetQueryInterface {
  id?: string;
  vehicle_id?: string;
  analyst_id?: string;
}
