import { api } from "boot/axios";
import { getTokenFromStorage } from "src/composable/utils";

export default {
  async requestAllContacts({ commit }) {
    const response = await api.get("/supplier-contacts", {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al cargar los datos");
    }

    commit("populateContactsData", response, data);
  },
  async requestContactsPerSupplier({ commit }, payload) {
    const response = await api.get(`/supplier-contacts?ownerId=${payload.id}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al cargar los datos");
    }

    commit("populateContactsPerSupplierData", response.data);
  },
  async createContactPerSupplier({ commit }, { data }) {
    const response = await api.post("/supplier-contacts", data, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 201) {
      throw new Error(response.message || "Hubo un error al crear al contacto");
    }
  },

  async updateContactPerSupplier({ commit }, { id, data }) {
    const response = await api.patch(`/supplier-contacts/${id}`, data, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.message || "Hubo un error al modificar el contacto"
      );
    }
  },

  async deleteContactPerSupplier({ commit }, payload) {
    const response = await api.delete(`/supplier-contacts/${payload.id}`, {
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
};
