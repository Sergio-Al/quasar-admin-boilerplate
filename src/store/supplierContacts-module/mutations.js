export default {
  populateContactsData(state, payload) {
    state.contacts = payload;
  },
  populateContactsPerSupplierData(state, payload) {
    state.contactsPerSupplier = payload;
  },
};
