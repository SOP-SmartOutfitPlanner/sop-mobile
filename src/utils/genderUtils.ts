import { Gender } from "../types/onboarding";

/**
 * Convert gender string to Gender enum
 * @param genderString - "male", "female", "other" (case insensitive)
 * @returns Gender enum value
 */
export const stringToGender = (genderString: string): Gender => {
  const genderLower = genderString.toLowerCase().trim();
  
  switch (genderLower) {
    case "female":
      return Gender.FEMALE;
    case "other":
      return Gender.OTHER;
    case "male":
    default:
      return Gender.MALE;
  }
};

/**
 * Convert Gender enum to display string
 * @param gender - Gender enum value
 * @returns Formatted string for display
 */
export const genderToString = (gender: Gender): string => {
  switch (gender) {
    case Gender.FEMALE:
      return "Female";
    case Gender.OTHER:
      return "Other";
    case Gender.MALE:
    default:
      return "Male";
  }
};

/**
 * Get all gender options for picker/selector
 * @returns Array of gender options
 */
export const getGenderOptions = () => [
  { label: "Male", value: Gender.MALE },
  { label: "Female", value: Gender.FEMALE },
  { label: "Other", value: Gender.OTHER },
];
