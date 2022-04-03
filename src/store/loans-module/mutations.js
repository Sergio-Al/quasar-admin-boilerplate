export default {
  createResource(state, payload) {
    state.loans.push(payload);
  },
  ReadResources(state, payload) {
    state.loans = payload;
  },
  registerReturn(state, payload) {
    state.loans = state.loans.map((loan) =>
      loan.id === payload.id ? { ...loan, estado: payload.estado } : loan
    );
  },
};
