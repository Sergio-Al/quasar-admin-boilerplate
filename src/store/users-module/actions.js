import { api } from "boot/axios";
import { getTokenFromStorage } from "src/composable/utils";

export default {
  async requestUsersData({ commit }) {
    const response = await api.get("/users", {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.message || "Hubo un error al capturar los datos"
      );
    }

    commit("populateUsersData", response.data);
  },
  async updateUserData({ commit }, payload) {
    const response = await api.patch(`/users/${payload.id}`, payload, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.message || "hubo un error al modificar los datos"
      );
    }
  },
  async deleteUserData({ commit }, payload) {
    const response = await api.delete(`/users/${payload.id}`, {
      headers: {
        Authorization: getTokenFromStorage(),
      },
    });

    if (response.status !== 200) {
      throw new Error(response.message || "Hubo un error al eliminar el dato");
    }
  },
};
