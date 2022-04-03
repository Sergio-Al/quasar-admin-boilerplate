import { api } from "src/boot/axios";

export default {
  async createBook({ commit }, payload) {
    const response = await api.post("/books", payload);

    if (response.status !== 201) {
      throw new Error("Hubo un error al cargar los datos");
    }

    const {
      data: { name },
    } = await api.get(`/authors/${payload.autor_id}`);
    commit("createResource", { ...response.data, nombre_autor: name });
  },
  async readBooks({ commit }) {
    const response = await api.get("/books");

    if (response.status !== 200) {
      throw new Error("Hubo un error al cargar los datos");
    }

    commit("ReadResources", response.data);
  },
  async updateBook({ commit }, payload) {
    const { id, ...dataToUpdate } = payload;
    const response = await api.patch(`/books/${id}`, dataToUpdate);

    if (response.status !== 200) {
      throw new Error("Hubo un error al actualizar los datos");
    }

    const {
      data: { name },
    } = await api.get(`/authors/${dataToUpdate.autor_id}`);
    commit("updateResource", { ...response.data, nombre_autor: name });
  },
  async deleteBook({ commit }, payload) {
    const { id } = payload;
    const response = await api.delete(`/books/${id}`);

    if (response.status !== 200) {
      throw new Error("Hubo un error al actualizar los datos");
    }

    commit("deleteResource", { id });
  },
};
