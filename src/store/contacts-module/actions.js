import { api } from "boot/axios";
import { getTokenFromStorage } from "src/composable/utils";

export default {
  async requestAllContacts({ commit }) {
    const response = await api.get("/contacts", {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al cargar los datos");
    }

    commit("populateContactsData", response.data);
  },
  async requestContactsPerClient({ commit }, payload) {
    const response = await api.get(`/contacts?ownerId=${payload.id}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al cargar los datos");
    }

    commit("populateContactsPerClientData", response.data);
  },
  async createContactPerClient({ commit }, payload) {
    const response = await api.post("/contacts", payload, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 201) {
      throw new Error(response.message || "Hubo un error al crear al contacto");
    }
  },

  async updateContactPerClient({ commit }, payload) {
    const id = payload.id;
    delete payload.id;
    const response = await api.patch(`/contacts/${id}`, payload, {
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

  async deleteContactPerClient({ commit }, payload) {
    const response = await api.delete(`/contacts/${payload.id}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });
    if (response.status !== 200) {
      throw new Error(
        response.message || "Ha ocurrido un error al eliminar el archivo"
      );
    }
  },
};
