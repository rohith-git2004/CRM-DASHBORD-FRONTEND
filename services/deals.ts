import api from "./api";

export interface Deal {
  _id?: string;
  company: string;
  person: string;
  value: number;
  stage: "New" | "Negotiation" | "Won" | "Lost";
  customer?: string;
}

export const getDeals = async (): Promise<Deal[]> => {
  const response = await api.get("/deals");
  return response.data;
};

export const getDeal = async (id: string): Promise<Deal> => {
  const response = await api.get(`/deals/${id}`);
  return response.data;
};

export const createDeal = async (
  data: Omit<Deal, "_id">
): Promise<Deal> => {
  const response = await api.post("/deals", data);
  return response.data;
};

export const updateDeal = async (
  id: string,
  data: Partial<Deal>
): Promise<Deal> => {
  const response = await api.put(`/deals/${id}`, data);
  return response.data;
};

export const deleteDeal = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/deals/${id}`);
  return response.data;
};