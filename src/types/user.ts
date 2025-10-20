export interface ProfileRequest{
    userId: number;
}
export interface ProfileResponse{
    statusCode: number;
    message: string;
    data: User;
}

export interface User {
   id: number;
  email: string;
  displayName: string;
  avtUrl: string | null;
  dob: string | null;
  gender: number;
  preferedColor: string | null;
  avoidedColor: string | null;
  location: string | null;
  bio: string | null;
  isVerifiedEmail: boolean;
  isStylist: boolean;
  isPremium: boolean;
  isLoginWithGoogle: boolean;
  isFirstTime: boolean;
  role: number;
  jobId: number | null;
  jobName: string | null;
  jobDescription: string | null;
  userStyles: string[];
}

