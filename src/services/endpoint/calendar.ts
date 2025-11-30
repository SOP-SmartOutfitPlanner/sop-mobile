import apiClient from "../api/apiClient";
import {
  GetCalenderRequest,
  GetCalendersResponse,
  CreateCalenderRequest,
  CreateCalenderResponse,
  EditCalenderRequest,
  EditCalenderResponse,
} from "../../types/calendar";

export const GetCalendarEntriesAPI = async (
  data: GetCalenderRequest
): Promise<GetCalendersResponse> => {
  const params: Record<string, string | number | boolean> = {
    "page-index": data.PageIndex,
    "page-size": data.PageSize,
  };

  if (data.Search) params["search"] = data.Search;
  if (data.takeAll !== undefined) params["take-all"] = data.takeAll;
  if (data.StartDate) params["start-date"] = data.StartDate;
  if (data.EndDate) params["end-date"] = data.EndDate;
  if (data.Year !== undefined) params["year"] = data.Year;
  if (data.Month !== undefined) params["month"] = data.Month;

  const response = await apiClient.get<GetCalendersResponse>(
    "/outfits/calendar",
    { params }
  );
  return response.data;
};

export const CreateCalendarEntryAPI = async (
  data: CreateCalenderRequest
): Promise<CreateCalenderResponse> => {
  // Validate outfitIds array
  if (!data.outfitIds || data.outfitIds.length === 0) {
    throw new Error("outfitIds array must contain at least one outfit ID");
  }

  // Validate request based on isDaily flag
  if (data.isDaily) {
    // isDaily = true: Must have time, must NOT have userOccasionId
    if (!data.time) {
      throw new Error("time is required when isDaily is true");
    }
    if (data.userOccasionId) {
      throw new Error("userOccasionId must not be provided when isDaily is true");
    }
  } else {
    // isDaily = false: Must have userOccasionId, must NOT have time
    if (!data.userOccasionId) {
      throw new Error("userOccasionId is required when isDaily is false");
    }
    if (data.time) {
      throw new Error("time must not be provided when isDaily is false");
    }
  }

  const response = await apiClient.post<CreateCalenderResponse>(
    "/outfits/calendar",
    data
  );
  return response.data;
};

export const EditCalendarEntryAPI = async (
  id: number,
  data: EditCalenderRequest
): Promise<EditCalenderResponse> => {
  const response = await apiClient.put<EditCalenderResponse>(
    `/outfits/calendar/${id}`,
    data
  );
  return response.data;
};

export const DeleteCalendarEntryAPI = async (
  id: number
): Promise<{ statusCode: number; message: string }> => {
  const response = await apiClient.delete<{
    statusCode: number;
    message: string;
  }>(`/outfits/calendar/${id}`);
  return response.data;
};


