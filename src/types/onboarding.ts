// Gender enum for onboarding
export enum Gender {
  MALE = 0,
  FEMALE = 1,
}
export interface OnboardingRequest {
    preferedColor: string[];
    avoidedColor: string[];
    gender: Gender;
    location: string;
    jobId?: number;
    otherJob?: string;
    dob: string;
    bio: string;
    styleIds?: number[];
    otherStyles?: string[];
    tryOnImageUrl?: string;
}

export interface OnboardingResponse {
    statusCode: number;
    message: string;
    data: {
        id: number;
        email: string;
        displayName: string;
        avtUrl: string | null;
        tryOnImageUrl: string | null;
        dob: string;
        gender: string;
        preferedColor: string[];
        avoidedColor: string[];
        location: string;
        bio: string;
        isVerifiedEmail: boolean;
        isPremium: boolean;
        isLoginWithGoogle: boolean;
        isFirstTime: boolean;
        role: string;
        jobId: number | null;
        jobName: string | null;
        jobDescription: string | null;
        userStyles: {
            id: number;
            styleId: number;
            styleName: string;
            styleDescription: string;
        }[];
        createdDate?: string;
        updatedDate?: string;
        isDeleted?: boolean;
    }
}
  