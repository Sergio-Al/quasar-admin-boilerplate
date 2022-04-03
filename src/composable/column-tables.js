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
    name: "email",
    required: true,
    label: "E-Mail",
    align: "left",
    field: (row) => row.email,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "celular",
    required: true,
    label: "Celular",
    align: "left",
    field: (row) => row.celular,
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

const columsnForBooks = [
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
    name: "titulo",
    required: true,
    label: "Titulo",
    align: "left",
    field: (row) => row.titulo,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "nombre_autor",
    required: true,
    label: "Nombre Autor",
    align: "left",
    field: (row) => row.nombre_autor,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "lote",
    required: true,
    label: "lote",
    align: "left",
    field: (row) => row.lote,
    format: (val) => `${val}`,
    sortable: true,
  },
];

export { columnsForAuthors, columnsForClients, columsnForBooks };
