import api from "./api";
import type { Negara, Pelabuhan, Barang } from "@/types";

export const apiService = {
  // Get all countries
  async getNegaras(): Promise<Negara[]> {
    try {
      const response = await api.get("/negaras");
      return response.data;
    } catch (error) {
      console.error("Error fetching negaras:", error);
      throw error;
    }
  },

  // Get ports by country ID
  async getPelabuhans(idNegara: number): Promise<Pelabuhan[]> {
    try {
      const filter = encodeURIComponent(
        JSON.stringify({
          where: { id_negara: idNegara },
        })
      );
      const response = await api.get(`/pelabuhans?filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pelabuhans:", error);
      throw error;
    }
  },

  // Get goods by port ID
  async getBarangs(idPelabuhan: number): Promise<Barang[]> {
    try {
      const filter = encodeURIComponent(
        JSON.stringify({
          where: { id_pelabuhan: idPelabuhan },
        })
      );
      const response = await api.get(`/barangs?filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching barangs:", error);
      throw error;
    }
  },
};
