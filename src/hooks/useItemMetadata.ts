import { useState, useEffect, useRef } from 'react';
import { GetOccasionsAPI } from '../services/endpoint/occasion';
import { GetSeasonsAPI } from '../services/endpoint/seasons';
import { GetStyles } from '../services/endpoint/onboarding';
import { Style } from '../types/style';
import { Season } from '../types/seasons';
import { Occasion } from '../types/occasion';

type MetadataCache = {
  styles: Style[] | null;
  occasions: Occasion[] | null;
  seasons: Season[] | null;
};

const metadataCache: MetadataCache = {
  styles: null,
  occasions: null,
  seasons: null,
};

let metadataPromise: Promise<void> | null = null;

const fetchMetadata = async () => {
  const [stylesResponse, occasionsResponse, seasonsResponse] = await Promise.all([
    GetStyles({ pageIndex: 0, pageSize: 0, takeAll: true }),
    GetOccasionsAPI({ pageIndex: 0, pageSize: 0, takeAll: true }),
    GetSeasonsAPI({ pageIndex: 0, pageSize: 0, takeAll: true }),
  ]);

  if (stylesResponse.statusCode === 200 && stylesResponse.data?.data) {
    metadataCache.styles = stylesResponse.data.data;
  }

  if (occasionsResponse.statusCode === 200 && occasionsResponse.data?.data) {
    metadataCache.occasions = occasionsResponse.data.data;
  }

  if (seasonsResponse.statusCode === 200 && seasonsResponse.data?.data) {
    metadataCache.seasons = seasonsResponse.data.data;
  }
};

export const useItemMetadata = () => {
  const [styles, setStyles] = useState<Style[]>(metadataCache.styles ?? []);
  const [occasions, setOccasions] = useState<Occasion[]>(metadataCache.occasions ?? []);
  const [seasons, setSeasons] = useState<Season[]>(metadataCache.seasons ?? []);
  const [isLoading, setIsLoading] = useState(
    !(metadataCache.styles && metadataCache.occasions && metadataCache.seasons)
  );
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const loadMetadata = async () => {
      if (metadataCache.styles && metadataCache.occasions && metadataCache.seasons) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        if (!metadataPromise) {
          metadataPromise = fetchMetadata().finally(() => {
            metadataPromise = null;
          });
        }

        await metadataPromise;

        if (!isMountedRef.current) return;

        setStyles(metadataCache.styles ?? []);
        setOccasions(metadataCache.occasions ?? []);
        setSeasons(metadataCache.seasons ?? []);
      } catch (err: any) {
        if (isMountedRef.current) {
          console.error('❌ Error fetching item metadata:', err);
          setError(err.message || 'Failed to fetch metadata');
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    loadMetadata();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fetchMetadata();
      if (isMountedRef.current) {
        setStyles(metadataCache.styles ?? []);
        setOccasions(metadataCache.occasions ?? []);
        setSeasons(metadataCache.seasons ?? []);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('❌ Error fetching item metadata:', err);
        setError(err.message || 'Failed to fetch metadata');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  return {
    styles,
    occasions,
    seasons,
    isLoading,
    error,
    refetch,
  };
};
