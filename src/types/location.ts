export interface Province {
  id: string;
  name: string;
  code?: string;
}

export interface District {
  id: string;
  name: string;
  provinceId: string;
  code?: string;
}

export interface Ward {
  id: string;
  name: string;
  districtId: string;
  code?: string;
}

export interface LocationData {
  province?: Province;
  district?: District;
  ward?: Ward;
}
