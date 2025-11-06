import axios from "axios";
import { Province, District, Ward } from "../../types/location";

// Using free Vietnam provinces API
const VIETNAM_API_BASE = "https://provinces.open-api.vn/api";

export interface VNProvinceResponse {
  code: number;
  name: string;
  codename?: string;
  division_type?: string;
  phone_code?: number;
  districts?: VNDistrictResponse[];
}

export interface VNDistrictResponse {
  code: number;
  name: string;
  codename?: string;
  division_type?: string;
  province_code?: number;
  wards?: VNWardResponse[];
}

export interface VNWardResponse {
  code: number;
  name: string;
  codename?: string;
  division_type?: string;
  district_code?: number;
}

// Get all provinces
export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await axios.get<VNProvinceResponse[]>(`${VIETNAM_API_BASE}/p/`);
    return response.data.map((p) => ({
      id: String(p.code),
      name: p.name,
      code: String(p.code),
    }));
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

// Get districts by province code
export const getDistricts = async (provinceCode: string): Promise<District[]> => {
  try {
    const response = await axios.get<VNProvinceResponse>(
      `${VIETNAM_API_BASE}/p/${provinceCode}?depth=2`
    );
    return (response.data.districts || []).map((d) => ({
      id: String(d.code),
      name: d.name,
      provinceId: provinceCode,
      code: String(d.code),
    }));
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

// Get wards by district code
export const getWards = async (districtCode: string): Promise<Ward[]> => {
  try {
    const response = await axios.get<VNDistrictResponse>(
      `${VIETNAM_API_BASE}/d/${districtCode}?depth=2`
    );
    return (response.data.wards || []).map((w) => ({
      id: String(w.code),
      name: w.name,
      districtId: districtCode,
      code: String(w.code),
    }));
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};
