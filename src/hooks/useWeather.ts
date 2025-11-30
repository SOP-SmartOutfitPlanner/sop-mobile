import { useState, useEffect } from "react";
import { weatherAPI } from "../services/endpoint/weather";
import { useAuth } from "./auth/useAuth";
import { Coordinates, DailyForecast } from "../types/weather";

interface UseWeatherOptions {
  cnt?: number;
  enabled?: boolean;
}

export const useWeather = (options: UseWeatherOptions = {}) => {
  const { cnt = 1, enabled = true } = options;
  const { user } = useAuth();
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Parse user location to get coordinates
  const getUserCoordinatesFromProfile = async (): Promise<Coordinates | null> => {
    if (!user?.location) {
      return null;
    }

    const location = user.location.trim();
    if (!location) {
      return null;
    }

    // Parse location formats:
    // - "ward, district, city, province" (e.g., "Phường 1, Quận 1, Hồ Chí Minh")
    // - "district, city, province" (e.g., "Quận 1, Hồ Chí Minh")
    // - "city, province" (e.g., "Hồ Chí Minh, Việt Nam")
    // - "city" (e.g., "Hồ Chí Minh" or "Hanoi")

    const parts = location.split(',').map(part => part.trim()).filter(Boolean);

    // Try different search strategies in order of specificity
    const searchTerms: string[] = [];

    if (parts.length >= 3) {
      // "ward, district, city" or "district, city, province"
      // Try last 2 parts (city, province or city)
      searchTerms.push(parts.slice(-2).join(', '));
      searchTerms.push(parts.slice(-1)[0]); // Just the last part (city/province)
    } else if (parts.length === 2) {
      // "city, province" - try both combinations
      searchTerms.push(parts.join(', ')); // Full "city, province"
      searchTerms.push(parts[0]); // Just city name
      searchTerms.push(parts[1]); // Just province name
    } else if (parts.length === 1) {
      // Just "city"
      searchTerms.push(parts[0]);
    }

    // Also add the full location string as a fallback
    if (!searchTerms.includes(location)) {
      searchTerms.push(location);
    }

    // Try each search term until we find a match
    for (const searchTerm of searchTerms) {
      try {
        const response = await weatherAPI.searchCities(searchTerm, 5);

        if (response.data?.cities && response.data.cities.length > 0) {
          const city = response.data.cities[0];

          return {
            latitude: city.latitude,
            longitude: city.longitude,
          };
        }
      } catch (error) {
        console.error(`Failed to search for "${searchTerm}":`, error);
        // Continue to next search term
      }
    }

    console.error("No matching city found for location:", location);
    return null;
  };

  // Request browser geolocation
  const requestLocation = async () => {
    setIsRequestingLocation(true);
    setLocationError(null);

    try {
      const coords = await weatherAPI.getCurrentLocation();
      setCoordinates(coords);
      setLocationError(null);
    } catch (error) {
      console.error("Geolocation error:", error);
      setLocationError(
        error instanceof Error
          ? error.message
          : "Failed to get your location. Using profile location instead."
      );

      // Fallback to user profile location
      const profileCoords = await getUserCoordinatesFromProfile();
      if (profileCoords) {
        setCoordinates(profileCoords);
      }
    } finally {
      setIsRequestingLocation(false);
    }
  };

  // Initialize coordinates
  useEffect(() => {
    const initializeLocation = async () => {
      if (coordinates) {
        return; // Already have coordinates
      }

      setIsRequestingLocation(true);
      setLocationError(null);

      // First, try profile location as a fallback in case browser location fails
      let fallbackCoords: Coordinates | null = null;
      try {
        fallbackCoords = await getUserCoordinatesFromProfile();
      } catch (error) {
        console.log("Profile location error:", error);
      }

      // Priority: Try to get user's browser location
      try {
        const coords = await weatherAPI.getCurrentLocation();
        setCoordinates(coords);
        setLocationError(null);
        setIsRequestingLocation(false);
        return;
      } catch (geoError) {
        console.log("Browser geolocation denied or unavailable:", geoError);
        // Browser location failed, use profile location if available
        if (fallbackCoords) {
          setCoordinates(fallbackCoords);
          setLocationError(null);
          setIsRequestingLocation(false);
          return;
        }
      }

      // No location available at all
      setLocationError(
        "Unable to determine location. Please share your location or update your profile with a city name."
      );
      setIsRequestingLocation(false);
    };

    // Only run if we don't have coordinates AND user is loaded
    if (enabled && !coordinates && user !== null) {
      initializeLocation();
    }
  }, [enabled, user?.location, user]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      if (!coordinates || !enabled) {
        return;
      }

      setIsLoadingWeather(true);
      setWeatherError(null);

      try {
        const response = await weatherAPI.getWeatherByCoordinates(
          coordinates.latitude,
          coordinates.longitude,
          cnt
        );

        if (response.statusCode === 200) {
          setWeatherData(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch weather");
        }
      } catch (error: any) {
        console.error("Failed to fetch weather:", error);
        setWeatherError(error.message || "Failed to fetch weather");
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [coordinates, cnt, enabled]);

  const todayForecast: DailyForecast | null =
    weatherData?.dailyForecasts?.[0] || null;

  return {
    // Weather data
    weatherData,
    todayForecast,
    cityName: weatherData?.cityName,

    // Location
    coordinates,
    requestLocation,
    isRequestingLocation,
    locationError,

    // Loading & error states
    isLoading: isLoadingWeather || isRequestingLocation,
    error: weatherError || locationError,
  };
};


