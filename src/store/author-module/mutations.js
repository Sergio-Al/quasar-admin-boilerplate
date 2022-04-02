export default {
  ReadResources(state, payload) {
    state.authors = payload;
  },
  createResource(state, payload) {
    state.authors.push(payload);
  },
  updateResource(state, payload) {
    state.authors = state.authors.map((author) =>
      author.id === payload.id ? { ...author, name: payload.name } : author
    );
  },
  deleteResource(state, payload) {
    state.authors = state.authors.filter((author) => author.id !== payload.id);
  },
};
