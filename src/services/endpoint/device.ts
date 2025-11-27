import apiClient from "../api/apiClient";

export interface RegisterDeviceRequest {
  userId: number;
  deviceToken: string;
  platform?: string;
}

export const registerUserDevice = async (
  payload: RegisterDeviceRequest
): Promise<void> => {
  await apiClient.post("/user-devices", payload);
};

export const deleteUserDevice = async (deviceToken: string): Promise<void> => {
  await apiClient.delete(`/user-devices/${encodeURIComponent(deviceToken)}`);
};





