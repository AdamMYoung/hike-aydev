import useSWRMutation from 'swr/mutation';

const syncStravaHistory = async (url: string) => {
  await fetch(url, {
    method: "POST",
  });

  return true;
};

export const useSyncStravaHistory = () => {
  return useSWRMutation(`/geo-api/strava/history`, syncStravaHistory);
};
