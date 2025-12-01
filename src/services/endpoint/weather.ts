import apiClient from "../api/apiClient";
import {
  WeatherResponse,
  SearchCitiesResponse,
  Coordinates,
} from "../../types/weather";
import * as Location from "expo-location";

class WeatherAPI {
  /**
   * Get weather forecast by coordinates
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @param cnt - Number of days to forecast (default: 1)
   */
  async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
    cnt: number = 1
  ): Promise<WeatherResponse> {
    try {
      const response = await apiClient.get<WeatherResponse>(
        `/weathers/by-coordinates`,
        {
          params: {
            latitude,
            longitude,
            cnt,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch weather by coordinates:", error);
      throw error;
    }
  }

  /**
   * Search cities in Vietnam
   * @param cityName - Name of the city to search
   * @param limit - Maximum number of results (optional)
   */
  async searchCities(
    cityName: string,
    limit?: number
  ): Promise<SearchCitiesResponse> {
    try {
      const response = await apiClient.get<SearchCitiesResponse>(
        `/weathers/search-cities`,
        {
          params: {
            cityName,
            ...(limit && { limit }),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to search cities:", error);
      throw error;
    }
  }

  /**
   * Get user's current location using expo-location
   */
  async getCurrentLocation(): Promise<Coordinates> {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission not granted");
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Failed to get current location:", error);
      throw error;
    }
  }
}

export const weatherAPI = new WeatherAPI();

