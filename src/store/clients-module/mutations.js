export default {
  populateClientsData(state, payload) {
    state.clients = payload;
  },
  populateClientData(state, payload) {
    state.selectedClientId = payload.id;
    state.selectedClientName = payload.name;
    state.selectedClientNIT = payload.nit;
    state.selectedClientAddress = payload.address;
  },
};
