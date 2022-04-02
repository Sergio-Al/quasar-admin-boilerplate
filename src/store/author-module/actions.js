import { api } from "boot/axios";

export default {
  async createAuthor({ commit }, payload) {
    const response = await api.post("/authors", payload);
    console.log("creating: ", response);

    if (response.status !== 201) {
      throw new Error("Hubo un error al cargar los datos");
    }

    commit("createResource", response.data);
  },
  async readAuthors({ commit }) {
    const response = await api.get("/authors");

    if (response.status !== 200) {
      throw new Error("Hubo un error al cargar los datos");
    }

    commit("ReadResources", response.data);
  },
  async updateAuthors({ commit }, payload) {
    const response = await api.patch(`/authors/${payload.id}`, {
      name: payload.name,
    });

    if (response.status !== 200) {
      throw new Error("Hubo un error al actualizar los datos");
    }

    commit("updateResource", response.data);
  },
  async deleteAuthors({ commit }, payload) {
    const response = await api.delete(`/authors/${payload.id}`);

    if (response.status !== 200) {
      throw new Error("Error al realizar la operacion");
    }

    commit("deleteResource", response.data);
  },
};
