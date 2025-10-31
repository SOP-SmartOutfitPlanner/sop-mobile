import { GetJobsResponse } from "../../types/job";
import { OnboardingRequest, OnboardingResponse } from "../../types/onboarding";
import { GetStylesRequest, GetStylesResponse } from "../../types/style";
import apiClient from "../api/apiClient";

export const GetJobs = async (): Promise<GetJobsResponse> => {
  const response = await apiClient.get<GetJobsResponse>("/jobs");
  return response.data;
}
export const GetStyles = async (params: GetStylesRequest): Promise<GetStylesResponse> => {
    const response = await apiClient.get<GetStylesResponse>("/styles", { params });
    return response.data;
}
export const Onboarding = async (onboardingData: OnboardingRequest): Promise<OnboardingResponse> => {
    const response = await apiClient.post<OnboardingResponse>("/user/onboarding", onboardingData);
    return response.data;
}