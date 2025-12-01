import { OccasionsListRequest, OccasionsListResponse } from "@/types/occasion";
import apiClient from "../api/apiClient";
import { CreateUserOccasionRequest, CreateUserOccasionResponse, EditUserOccasionRequest, EditUserOccasionResponse, GetUserOccasionRequest, GetUserOccasionsResponse } from "@/types/userOccasion";
import { CreateCalenderRequest, CreateCalenderResponse, EditCalenderRequest, EditCalenderResponse, GetCalenderRequest, GetCalendersResponse } from "@/types/calendar";



export const CalenderAPI = {
  // Occasions
  getOccasions: async (data: OccasionsListRequest): Promise<OccasionsListResponse> => {
    const params: Record<string, string | number | boolean> = {
      'page-index': data.PageIndex,
      'page-size': data.PageSize,
    };
    
    if (data.Search) {
      params['search'] = data.Search;
    }
    
    if (data.takeAll !== undefined) {
      params['take-all'] = data.takeAll;
    }
    
    const response = await apiClient.get<OccasionsListResponse>(`/occasions`, { params });
    return response.data;
  },

  // User Occasions
  getUserOccasions: async (data: GetUserOccasionRequest): Promise<GetUserOccasionsResponse> => {
    const params: Record<string, string | number | boolean> = {
      'page-index': data.PageIndex,
      'page-size': data.PageSize,
    };
    
    if (data.Search) params['search'] = data.Search;
    if (data.takeAll !== undefined) params['take-all'] = data.takeAll;
    if (data.StartDate) params['start-date'] = data.StartDate;
    if (data.EndDate) params['end-date'] = data.EndDate;
    if (data.Year !== undefined) params['year'] = data.Year;
    if (data.Month !== undefined) params['month'] = data.Month;
    if (data.UpcomingDays !== undefined) params['upcoming-days'] = data.UpcomingDays;
    if (data.Today !== undefined) params['today'] = data.Today;
    
    const response = await apiClient.get<GetUserOccasionsResponse>(`/user-occasions`, { params });
    return response.data;
  },

  getUserOccasion: async (id: number): Promise<CreateUserOccasionResponse> => {
    const response = await apiClient.get<CreateUserOccasionResponse>(`/user-occasions/${id}`);
    return response.data;
  },

  createUserOccasion: async (data: CreateUserOccasionRequest): Promise<CreateUserOccasionResponse> => {
    const response = await apiClient.post<CreateUserOccasionResponse>(`/user-occasions`, data);
    return response.data;
  },

  updateUserOccasion: async (id: number, data: Partial<EditUserOccasionRequest>): Promise<EditUserOccasionResponse> => {
    const response = await apiClient.put<EditUserOccasionResponse>(`/user-occasions/${id}`, data);
    return response.data;
  },

  deleteUserOccasion: async (id: number): Promise<{ statusCode: number; message: string }> => {
    const response = await apiClient.delete(`/user-occasions/${id}`);
    return response.data;
  },

  // Outfit Calendar
  getCalendarEntries: async (data: GetCalenderRequest): Promise<GetCalendersResponse> => {
    const params: Record<string, string | number | boolean> = {
      'page-index': data.PageIndex,
      'page-size': data.PageSize,
    };
    
    if (data.Search) params['search'] = data.Search;
    if (data.takeAll !== undefined) params['take-all'] = data.takeAll;
    if (data.StartDate) params['start-date'] = data.StartDate;
    if (data.EndDate) params['end-date'] = data.EndDate;
    if (data.Year !== undefined) params['year'] = data.Year;
    if (data.Month !== undefined) params['month'] = data.Month;
    
    const response = await apiClient.get<GetCalendersResponse>(`/outfits/calendar`, { params });
    return response.data;
  },

  createCalendarEntry: async (data: CreateCalenderRequest): Promise<CreateCalenderResponse> => {
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

    const response = await apiClient.post<CreateCalenderResponse>(`/outfits/calendar`, data);
    return response.data;
  },

  updateCalendarEntry: async (id: number, data: EditCalenderRequest): Promise<EditCalenderResponse> => {
    const response = await apiClient.put<EditCalenderResponse>(`/outfits/calendar/${id}`, data);
    return response.data;
  },

  deleteCalendarEntry: async (id: number): Promise<{ statusCode: number; message: string }> => {
    const response = await apiClient.delete(`/outfits/calendar/${id}`);
    // Axios returns { data: {...}, status: 200, ... }
    // The API response is in response.data: { statusCode: 200, message: "...", data: null }
    return response.data;
  }
}