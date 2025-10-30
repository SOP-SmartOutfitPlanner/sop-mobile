import { useState } from 'react';
import { Onboarding, GetJobs, GetStyles } from '../../services/endpoint/onboarding';
import { OnboardingRequest } from '../../types/onboarding';
import { Job } from '../../types/job';
import { Style } from '../../types/style';

export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);

  // Fetch jobs list
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await GetJobs();
      if (response.statusCode === 200) {
        setJobs(response.data);
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch jobs');
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      throw new Error(error?.message || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch styles list
  const fetchStyles = async () => {
    try {
      setIsLoading(true);
      const response = await GetStyles();
      if (response.statusCode === 200) {
        // Extract data from nested structure
        const stylesList = response.data.data;
        setStyles(stylesList);
        return stylesList;
      }
      throw new Error(response.message || 'Failed to fetch styles');
    } catch (error: any) {
      console.error('Error fetching styles:', error);
      throw new Error(error?.message || 'Failed to fetch styles');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit onboarding data
  const submitOnboarding = async (data: OnboardingRequest) => {
    try {
      setIsLoading(true);
      const response = await Onboarding(data);
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to submit onboarding');
    } catch (error: any) {
      console.error('Error submitting onboarding:', error);
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to submit onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    jobs,
    styles,
    fetchJobs,
    fetchStyles,
    submitOnboarding,
  };
};
