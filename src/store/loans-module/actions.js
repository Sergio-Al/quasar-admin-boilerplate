import { api } from "boot/axios";

export default {
  async createLoan({ commit }, payload) {
    const response = await api.post("/loans-register", payload);

    if (response.status !== 201) {
      throw new Error("Hubo un error al crear los datos");
    }

    const {
      data: { titulo },
    } = await api.get(`/books/${payload.libro_id}`);
    const {
      data: { name },
    } = await api.get(`/clients/${payload.cliente_id}`);
    commit("createResource", {
      ...response.data,
      nombre_libro: titulo,
      nombre_cliente: name,
    });
  },
  async readLoans({ commit }, payload) {
    const response = await api.get("/loans");

    if (response.status !== 200) {
      throw new Error("Hubo un error al cargar los datos");
    }

    commit("ReadResources", response.data);
  },
  async registerReturn({ commit }, payload) {
    const response = await api.post(`/loan-return/${payload.id}`);

    if (response.status !== 200) {
      throw new Error("Hubo un error al eliminar el dato");
    }

    commit("registerReturn", response.data);
  },
};
