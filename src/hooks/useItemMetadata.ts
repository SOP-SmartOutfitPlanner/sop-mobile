import { useState, useEffect } from 'react';
import { GetOccasionsAPI } from '../services/endpoint/occasion';
import { GetSeasonsAPI } from '../services/endpoint/seasons';
import { GetStyles } from '../services/endpoint/onboarding';
import { Style } from '../types/style';
import { Season } from '../types/seasons';
import { Occasion } from '../types/occasion';





export const useItemMetadata = () => {
  const [styles, setStyles] = useState<Style[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllMetadata();
  }, []);

  const fetchAllMetadata = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [stylesResponse, occasionsResponse, seasonsResponse] = await Promise.all([
        GetStyles({ pageIndex: 0, pageSize: 0, takeAll: true }),
        GetOccasionsAPI({ pageIndex: 0, pageSize: 0, takeAll: true }),
        GetSeasonsAPI({ pageIndex: 0, pageSize: 0, takeAll: true }),
      ]);

      // Handle Styles
      if (stylesResponse.statusCode === 200 && stylesResponse.data?.data) {
        setStyles(stylesResponse.data.data);
      }

      // Handle Occasions
      if (occasionsResponse.statusCode === 200 && occasionsResponse.data?.data) {
        setOccasions(occasionsResponse.data.data);
      }

      // Handle Seasons
      if (seasonsResponse.statusCode === 200 && seasonsResponse.data?.data) {
        setSeasons(seasonsResponse.data.data);
      }

    } catch (err: any) {
      console.error('❌ Error fetching item metadata:', err);
      setError(err.message || 'Failed to fetch metadata');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    styles,
    occasions,
    seasons,
    isLoading,
    error,
    refetch: fetchAllMetadata,
  };
};
