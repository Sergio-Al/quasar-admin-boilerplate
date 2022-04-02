export default {
  populateSuppliersData(state, payload) {
    state.suppliers = payload;
  },
  populateSupplierData(state, payload) {
    state.selectedSupplierId = payload.id;
    state.selectedSupplierName = payload.name;
    state.selectedSupplierNIT = payload.nit;
    state.selectedSupplierAddress = payload.address;
  },
};
