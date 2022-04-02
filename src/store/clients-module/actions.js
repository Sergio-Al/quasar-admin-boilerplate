import { api } from "boot/axios";
import { getTokenFromStorage } from "src/composable/utils";

export default {
  async requestAllClients({ commit }) {
    const response = await api.get("/clients", {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al cargar los datos");
    }

    commit("populateClientsData", response.data);
  },
  async requestClient({ commit }, payload) {
    const response = await api.get(`/clients/${payload.id}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al cargar el dato");
    }

    commit("populateClientData", response.data);
  },
  async createClient({ commit }, payload) {
    const response = await api.post("/clients", payload, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 201) {
      throw new Error(response.mesage || "Ocurrio un error al crear el dato");
    }
  },
  async deleteClient({ commit }, payload) {
    const response = await api.delete(`/clients/${payload.id}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.message || "Ha ocurrido un error al eliminar el dato"
      );
    }
  },
  async modifyClient({ commit }, payload) {
    const response = await api.patch(`/clients/${payload.id}`, payload.data, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.message || "Hubo un error al modificar los datos"
      );
    }
  },
};
