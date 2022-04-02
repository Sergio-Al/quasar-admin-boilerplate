const columnsForClients = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`, // format of sort
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "nit",
    required: true,
    label: "NIT",
    align: "left",
    field: (row) => row.nit,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "address",
    required: true,
    label: "Dirección",
    align: "left",
    field: (row) => row.address,
    sortable: true,
  },
];

const columnsForAuthors = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
];

export {
  columnsForAuthors,
  columnsForClients,
};
