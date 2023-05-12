import useSWRMutation from 'swr/mutation';

type UploadGPXResult = {
  total: number;
  inserted: number;
};

const uploadGPX = async (url: string, { arg }: { arg: FormData }): Promise<UploadGPXResult> => {
  const res = await fetch(url, {
    method: "POST",
    body: arg,
  });

  return res.json();
};

export const useUploadGPX = () => {
  return useSWRMutation(`/geo-api/activities/manual`, uploadGPX);
};
