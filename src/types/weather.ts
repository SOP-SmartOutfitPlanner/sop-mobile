export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Wind {
  speed: {
    value: number;
    unit: string;
  };
  direction: {
    value: number;
    unit: string;
  };
}

export interface DailyForecast {
  date: string;
  temperature: number;
  feelsLike: number;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  pressure: number;
  cloudCoverage: number;
  description: string;
  wind: Wind;
}

export interface WeatherResponse {
  statusCode: number;
  message: string;
  data: {
    cityName: string;
    coordinates: Coordinates;
    dailyForecasts: DailyForecast[];
  };
}

export interface City {
  id: number;
  name: string;
  localName: string;
  latitude: number;
  longitude: number;
}

export interface SearchCitiesResponse {
  statusCode: number;
  message: string;
  data: {
    cities: City[];
  };
}

