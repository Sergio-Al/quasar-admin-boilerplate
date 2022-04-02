import { api } from "boot/axios";
import { getTokenFromStorage } from "src/composable/utils";

export default {
  async createSupplier({ commit }, payload) {
    const response = await api.post("/suppliers", payload, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 201) {
      throw new Error(response.message || "Ocurrio un error al crear el dato");
    }
  },
  async requestAllSuppliers({ commit }) {
    const response = await api.get("/suppliers", {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al cargar los datos");
    }

    commit("populateSuppliersData", response.data);
  },
  async requestSupplier({ commit }, { id }) {
    const response = await api.get(`/suppliers/${id}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al cargar el dato");
    }

    commit("populateSupplierData", response.data);
  },
  async modifySupplier({ commit }, { id, data }) {
    const response = await api.patch(`/suppliers/${id}`, data, {
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
  async deleteSupplier({ commit }, { id }) {
    const response = await api.delete(`/suppliers/${id}`, {
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
