import { useState, useEffect } from "react";
import { Province, District, Ward } from "../types/location";
import { getDistricts, getProvinces, getWards } from "../services/endpoint/location";

export const useLocation = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState<boolean>(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
  const [isLoadingWards, setIsLoadingWards] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      setIsLoadingProvinces(true);
      setError(null);
      const data = await getProvinces();
      setProvinces(data);
    } catch (err: any) {
      setError(err.message || "Failed to load provinces");
      console.error("Error fetching provinces:", err);
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  const fetchDistricts = async (provinceId: string) => {
    try {
      setIsLoadingDistricts(true);
      setError(null);
      setDistricts([]); // Clear previous districts
      setWards([]); // Clear wards when province changes
      const data = await getDistricts(provinceId);
      setDistricts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load districts");
      console.error("Error fetching districts:", err);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const fetchWards = async (districtId: string) => {
    try {
      setIsLoadingWards(true);
      setError(null);
      setWards([]); // Clear previous wards
      const data = await getWards(districtId);
      setWards(data);
    } catch (err: any) {
      setError(err.message || "Failed to load wards");
      console.error("Error fetching wards:", err);
    } finally {
      setIsLoadingWards(false);
    }
  };

  return {
    provinces,
    districts,
    wards,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    error,
    fetchProvinces,
    fetchDistricts,
    fetchWards,
  };
};
