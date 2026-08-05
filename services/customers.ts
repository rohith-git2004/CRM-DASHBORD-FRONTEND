import api from "./api";

export interface Customer {
  _id: string;

  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;

  notes?: string;

  // NEW FIELD
  lastContact?: string;

  createdAt?: string;
  updatedAt?: string;

  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get("/customers");
  return response.data;
};

export const getCustomer = async (
  id: string
): Promise<Customer> => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (
  data: Omit<
    Customer,
    "_id" | "createdBy" | "createdAt" | "updatedAt"
  >
): Promise<Customer> => {
  const response = await api.post("/customers", data);
  return response.data;
};

export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {
  const response = await api.put(`/customers/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};