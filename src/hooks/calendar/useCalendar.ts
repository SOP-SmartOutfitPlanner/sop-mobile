import { useState, useCallback } from "react";
import { CalenderAPI } from "../../services/endpoint/calendar";
import {
  GetCalenderRequest,
  CreateCalenderRequest,
  EditCalenderRequest,
  CalendarEntry,
} from "../../types/calendar";
import { CreateUserOccasionRequest, EditUserOccasionRequest } from "../../types/userOccasion";
import { useNotification } from "../notification/useNotification";

export const useCalendar = () => {
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    showError,
    showSuccess,
    visible,
    config,
    hideNotification,
  } = useNotification();

  // Fetch calendar entries
  const fetchCalendarEntries = useCallback(
    async (params?: Partial<GetCalenderRequest>) => {
      try {
        setLoading(true);
        setError(null);

        const request: GetCalenderRequest = {
          PageIndex: 1,
          PageSize: 100,
          takeAll: true,
          ...params,
        };

        const response = await CalenderAPI.getCalendarEntries(request);

        if (response.statusCode === 200 && response.data?.data) {
          setCalendarEntries(response.data.data);
          return response.data.data;
        } else {
          throw new Error(response.message || "Failed to fetch calendar entries");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to fetch calendar entries";
        setError(errorMessage);
        showError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  // Create calendar entry (assign outfit to date)
  const createCalendarEntry = useCallback(
    async (data: CreateCalenderRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await CalenderAPI.createCalendarEntry(data);

        if (response.statusCode === 200 && response.data) {
          showSuccess("Outfit added to calendar successfully!");
          // Refresh calendar entries
          await fetchCalendarEntries();
          return response.data;
        } else {
          throw new Error(response.message || "Failed to add outfit to calendar");
        }
      } catch (err: any) {
        // Extract error message from API response if available
        let errorMessage = "Failed to add outfit to calendar";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showError, showSuccess, fetchCalendarEntries]
  );

  // Update calendar entry
  const updateCalendarEntry = useCallback(
    async (id: number, data: EditCalenderRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await CalenderAPI.updateCalendarEntry(id, data);

        if (response.statusCode === 200 && response.data) {
          showSuccess("Calendar entry updated successfully!");
          await fetchCalendarEntries();
          return response.data;
        } else {
          throw new Error(response.message || "Failed to update calendar entry");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to update calendar entry";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showError, showSuccess, fetchCalendarEntries]
  );

  // Delete calendar entry
  const deleteCalendarEntry = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        const response = await CalenderAPI.deleteCalendarEntry(id);

        if (response.statusCode === 200) {
          showSuccess("Outfit removed from calendar successfully!");
          
          // Fetch all calendar entries to refresh the list
          await fetchCalendarEntries({ takeAll: true });
          
          setLoading(false);
          return true;
        } else {
          throw new Error(response.message || "Failed to remove outfit from calendar");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to remove outfit from calendar";
        setError(errorMessage);
        showError(errorMessage);
        setLoading(false);
        return false;
      }
    },
    [showError, showSuccess, fetchCalendarEntries]
  );

  // Use outfit today (simplified - creates daily entry)
  const useOutfitToday = useCallback(
    async (outfitId: number, date: Date) => {
      const formattedDate = date.toISOString().slice(0, 19).replace("T", "T");
      
      return await createCalendarEntry({
        outfitIds: [outfitId],
        isDaily: true,
        time: formattedDate,
        endTime: formattedDate,
      });
    },
    [createCalendarEntry]
  );

  // Create user occasion
  const createUserOccasion = useCallback(
    async (data: CreateUserOccasionRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await CalenderAPI.createUserOccasion(data);

        // Accept both 200 (OK) and 201 (Created) as success
        if (response.statusCode === 201 && response.data) {
          showSuccess("Occasion created successfully!");
          // Fetch all calendar entries to refresh the list
          await fetchCalendarEntries({ takeAll: true });
          return response.data;
        } else {
          throw new Error(response.message || "Failed to create occasion");
        }
      } catch (err: any) {
        // Extract error message from API response if available
        let errorMessage = "Failed to create occasion";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showError, showSuccess, fetchCalendarEntries]
  );

  // Update user occasion
  const updateUserOccasion = useCallback(
    async (id: number, data: Partial<EditUserOccasionRequest>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await CalenderAPI.updateUserOccasion(id, data);

        if (response.statusCode === 200 && response.data) {
          showSuccess("Occasion updated successfully!");
          // Fetch all calendar entries to refresh the list
          await fetchCalendarEntries({ takeAll: true });
          return response.data;
        } else {
          throw new Error(response.message || "Failed to update occasion");
        }
      } catch (err: any) {
        // Extract error message from API response if available
        let errorMessage = "Failed to update occasion";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showError, showSuccess, fetchCalendarEntries]
  );

  // Delete user occasion
  const deleteUserOccasion = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        const response = await CalenderAPI.deleteUserOccasion(id);

        if (response.statusCode === 200) {
          showSuccess("Occasion deleted successfully!");
          
          // Fetch all calendar entries to refresh the list
          await fetchCalendarEntries({ takeAll: true });
          
          setLoading(false);
          return true;
        } else {
          throw new Error(response.message || "Failed to delete occasion");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to delete occasion";
        setError(errorMessage);
        showError(errorMessage);
        setLoading(false);
        return false;
      }
    },
    [showError, showSuccess, fetchCalendarEntries]
  );

  return {
    calendarEntries,
    loading,
    error,
    fetchCalendarEntries,
    createCalendarEntry,
    updateCalendarEntry,
    deleteCalendarEntry,
    createUserOccasion,
    updateUserOccasion,
    deleteUserOccasion,
    useOutfitToday,
    showError,
    showSuccess,
    visible,
    config,
    hideNotification,
  };
};

