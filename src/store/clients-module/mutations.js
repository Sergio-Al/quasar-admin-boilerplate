export default {
  createResource(state, payload) {
    state.clients.push(payload);
  },
  ReadResources(state, payload) {
    state.clients = payload;
  },
  updateResource(state, payload) {
    state.clients = state.clients.map((client) =>
      client.id === payload.id
        ? {
            ...client,
            name: payload.name,
            email: payload.email,
            celular: payload.celular,
          }
        : client
    );
  },
  deleteResource(state, payload) {
    state.clients = state.clients.filter((client) => client.id !== payload.id);
  },
};
