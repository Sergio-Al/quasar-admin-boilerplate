export default {
  populateContactsData(state, payload) {
    state.contacts = payload;
  },
  populateContactsPerClientData(state, payload) {
    state.contactsPerClient = payload;
  },
};
