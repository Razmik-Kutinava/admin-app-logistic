// Types for Yerevan districts and streets
export interface YerevanDistrict {
  id: string;
  name_ru: string;
  name_hy?: string;
  area_km2?: number;
  population?: number;
  center_lat: number;
  center_lon: number;
  description?: string;
  created_at: string;
}

export interface YerevanStreet {
  id: string;
  district_id: string;
  name_ru: string;
  name_hy?: string;
  street_type: string;
  length_km?: number;
  start_lat?: number;
  start_lon?: number;
  end_lat?: number;
  end_lon?: number;
  is_main: boolean;
  created_at: string;
}

export interface DriverWithDistrict {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  hub_id: string;
  status: string;
  district_id?: string;
  district?: YerevanDistrict;
  created_at: string;
}
