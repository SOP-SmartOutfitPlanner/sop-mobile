// Gender enum for onboarding
export enum Gender {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
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
}

export interface OnboardingResponse {
    statusCode: number;
    message: string;
    data: {
        email: string;
        passwordHash: string;
        role: number;
        displayName: string;
        isVerifiedEmail: boolean;
        isStylist: boolean;
        isPremium: boolean;
        isLoginWithGoogle: boolean;
        isFirstTime: boolean;
        avtUrl: string | null;
        dob: string;
        gender: number;
        preferedColor: string;
        avoidedColor: string;
        location: string;
        bio: string;
        jobId: number;
        items: any[];
        job: any | null;
        userStyles: {
            userId: number;
            styleId: number;
            style: any | null;
            user: any | null;
            id: number;
            createdDate: string;
            updatedDate: string | null;
            isDeleted: boolean;
        };
        posts: any[];
        id: number;
        createdDate: string;
        updatedDate: string;
        isDeleted: boolean;
    }
}
  