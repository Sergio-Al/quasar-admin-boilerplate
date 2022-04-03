export default {
  createResource(state, payload) {
    state.books.push(payload);
  },
  ReadResources(state, payload) {
    state.books = payload;
  },
  updateResource(state, payload) {
    state.books = state.books.map((book) =>
      payload.id === book.id ? { ...book, ...payload } : book
    );
  },
  deleteResource(state, payload) {
    state.books = state.books.filter((book) => book.id !== payload.id);
  },
};
