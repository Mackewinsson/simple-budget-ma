import client from "./client";

export const getUserByEmail = async (email: string) => {
  const { data } = await client.get(`/api/users?email=${encodeURIComponent(email)}`);
  return data[0];
};

export const getUserCurrency = async (): Promise<string> => {
  const { data } = await client.get("/api/users/currency");
  return data.currency;
};

export const updateUserCurrency = async (currency: string): Promise<{ currency: string }> => {
  const { data } = await client.put("/api/users/currency", { currency });
  return data;
};
