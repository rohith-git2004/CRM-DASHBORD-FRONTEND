import api from "./api";

export interface DashboardStats {
  totalCustomers: number;
  activeLeads: number;
  contactedThisWeek: number;
  totalDeals: number;
  wonDeals: number;
  lostDeals: number;
}

export const getDashboardStats =
  async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  };