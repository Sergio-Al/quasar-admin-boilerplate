import { api } from "boot/axios";

export default {
  async createClient({ commit }, payload) {
    const response = await api.post("/clients", payload);
    console.log("creating: ", response);

    if (response.status !== 201) {
      throw new Error("Hubo un error al cargar los datos");
    }

    commit("createResource", response.data);
  },
  async readClients({ commit }) {
    const response = await api.get("/clients");

    if (response.status !== 200) {
      throw new Error("Hubo un error al cargar los datos");
    }

    commit("ReadResources", response.data);
  },
  async updateClient({ commit }, payload) {
    const { id, ...updateData } = payload;
    const response = await api.patch(`/clients/${id}`, updateData);

    if (response.status !== 200) {
      throw new Error("Hubo un error al actualizar los datos");
    }

    commit("updateResource", response.data);
  },
  async deleteClient({ commit }, payload) {
    const response = await api.delete(`/clients/${payload.id}`);

    if (response.status !== 200) {
      throw new Error("Error al realizar la operacion");
    }

    commit("deleteResource", response.data);
  },
};
