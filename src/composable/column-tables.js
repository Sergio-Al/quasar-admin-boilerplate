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
const columnsForSuppliers = [
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

const columnsForUsers = [
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
  {
    name: "email",
    required: true,
    label: "Correo Electrónico",
    align: "left",
    field: (row) => row.email,
    sortable: true,
  },
  {
    name: "role",
    required: true,
    label: "Rol",
    align: "left",
    field: (row) => row.role,
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

const columnsForContacts = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`, // sorting format
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => `${row.name} ${row.lastName}`,
    sortable: true,
  },
  {
    name: "telephone",
    required: true,
    label: "Teléfono",
    align: "left",
    field: (row) => row.telephone,
    sortable: true,
  },
  {
    name: "email",
    require: true,
    label: "Correo Electronico",
    align: "left",
    field: (row) => row.email,
    sortable: true,
  },
  {
    name: "company",
    required: true,
    label: "Compañia",
    align: "left",
    field: (row) => row.company,
    sortable: true,
  },
  {
    name: "city",
    required: true,
    label: "Región/Pais",
    align: "left",
    field: (row) => `${row.city} - ${row.country}`,
    sortable: true,
  },
];

export {
  columnsForAuthors,
  columnsForClients,
  columnsForUsers,
  columnsForContacts,
  columnsForSuppliers,
};
