export const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  return url && url.length > 0 ? url : "http://localhost:3000";
};


