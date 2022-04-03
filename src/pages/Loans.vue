<template>
  <q-page class="q-pa-lg">
    <!-- Layout Page -->
    <div class="container">
      <div class="row">
        <div class="column">
          <h4>Prestamos</h4>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <q-btn
            :outline="isDarkModeActive"
            color="primary"
            class="create-button"
            icon="bookmarks"
            label="Registrar Prestamo"
            @click="openRegisterDialog()"
          />
        </div>
      </div>

      <div class="row">
        <div class="column custom-column">
          <div class="q-py-md user-table">
            <q-table
              title="Loans"
              :rows="rows"
              :columns="columns"
              row-key="id"
              :filter="filter"
              :loading="isLoadingTable"
              :rows-per-page-options="[10]"
            >
              <template v-slot:top>
                <q-space />
                <q-input
                  outlined
                  dense
                  label="Filtrar"
                  debounce="300"
                  color="primary"
                  v-model="filter"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
                  <q-td auto-width>
                    <q-btn
                      :outline="isDarkModeActive"
                      size="sm"
                      class="q-mx-xs"
                      color="primary"
                      icon="post_add"
                      round
                      v-show="props.row.estado === 'En Prestamo'"
                      @click="openReturnDialog(props.row)"
                    >
                      <q-tooltip>Registrar devolucion</q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>"
            </q-table>
          </div>
        </div>
      </div>
    </div>
    <!-- Dialogs -->
    <q-dialog v-model="isRegisterDialogOpen" persistent>
      <q-card class="creation-card-simple q-pa-sm">
        <q-card-section>
          <div class="text-h6">Registrar Prestamo</div>
        </q-card-section>
        <q-card-actions>
          <div>
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <div class="flex column">
                <q-select
                  filled
                  v-model="libroSelected"
                  use-chips
                  label="Selecciona un libro"
                  class="q-mb-md"
                  :options="libros"
                  @filter="filterLibrosFn"
                  @filter-abort="abortFilterLibrosFn"
                  style="width: 250px"
                  :rules="[(val) => (val && val.toString().length > 0) || 'Selecciona un libro']"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">No hay resultados</q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <q-select
                  filled
                  v-model="clienteSelected"
                  use-chips
                  label="Selecciona un Cliente"
                  class="q-mb-md"
                  :options="clientes"
                  @filter="filterClientesFn"
                  @filter-abort="abortFilterClientesFn"
                  style="width: 250px"
                  :rules="[(val) => (val && val.toString().length > 0) || 'Selecciona un cliente']"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">No hay resultados</q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <div>
                  <q-badge color="info" text-color="black">Prestamo: {{ diasPrestamo }} Dias</q-badge>
                  <q-slider v-model="diasPrestamo" :min="1" :max="30" :step="1" color="blue" />
                </div>

                <div class="flex column">
                  <div class="q-mb-md">
                    <q-btn label="Registar" type="submit" color="primary" />
                    <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
                  </div>
                  <div>
                    <q-btn color="primary" label="Cancelar" @click="onCancel" />
                  </div>
                </div>
              </div>
            </q-form>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isReturnDialogOpen" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Devolucion</div>
          <div class="text-subtitle2">
            <strong>Devolver:</strong>
            {{ " " + loanToReturnData.nombre_libro }}
          </div>
          <div class="text-subtitle2">
            <strong>Prestado a:</strong>
            {{ " " + loanToReturnData.nombre_cliente }}
          </div>
          <q-card-actions align="right">
            <q-btn label="Cancelar" color="primary" v-close-popup />
            <q-btn
              flat
              label="Registrar devolucion"
              color="primary"
              @click="returnLoan(loanToReturnData.id)"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { positiveMessage, negativeMessage } from "src/composable/light-notify";
import { columnsForLoans } from "../composable/column-tables";

const columns = columnsForLoans;

export default {
  setup() {
    // general variables
    const $store = useStore();
    const $q = useQuasar();

    // Table Variables
    const rows = ref([]);
    const filter = ref("");
    const isLoadingTable = ref(false);

    // Dialogs
    const isRegisterDialogOpen = ref(false);
    const isReturnDialogOpen = ref(false);
    const libroSelected = ref(null);
    const libros = ref(null);
    const clienteSelected = ref(null);
    const clientes = ref(null);
    const diasPrestamo = ref(12);
    const loanToReturnData = ref(null);

    const isDarkModeActive = computed(() => $q.dark.isActive);

    // Get all data for the first render
    (async function setupLoans() {
      isLoadingTable.value = true;
      try {
        await $store.dispatch("loansModule/readLoans");
        isLoadingTable.value = false;
        rows.value = $store.state.loansModule.loans;
      } catch (error) {
        negativeMessage("Error", "Hubo un error al cargar los datos");
      }
    })();

    // Events in the page
    const openRegisterDialog = () => {
      isRegisterDialogOpen.value = !isRegisterDialogOpen.value;
    }

    const openReturnDialog = (data) => {
      isReturnDialogOpen.value = !isReturnDialogOpen.value;
      loanToReturnData.value = data;
    }

    const onSubmit = async () => {
      const today = new Date();

      await $store.dispatch("loansModule/createLoan", {
        libro_id: Number(libroSelected.value.split(" ")[0]),
        cliente_id: Number(clienteSelected.value.split(" ")[0]),
        fecha_prestamo: today.toISOString().slice(0, 19).replace('T', ' '),
        dias_prestamo: diasPrestamo.value,
        estado: "En Prestamo"
      });
      rows.value = $store.state.loansModule.loans;
      isRegisterDialogOpen.value = false;
      positiveMessage("Exito", "Se ha creado un nuevo prestamo");
      onReset();
    }

    const onReset = () => {
      libroSelected.value = null;
      clienteSelected.value = null;
      diasPrestamo.value = 12;
    }

    const onCancel = () => {
      onReset();
      isRegisterDialogOpen.value = !isRegisterDialogOpen.value;
    }

    const filterLibrosFn = async (val, update, abort) => {
      if (libros.value !== null) {
        update();
        return;
      }

      await $store.dispatch("booksModule/readBooks");
      const allLibros = [...$store.state.booksModule.books]
        .map((libro) => `${libro.id} ${libro.titulo}`);

      update(() => {
        libros.value = allLibros;
      })
    }

    const returnLoan = async (id) => {
      try {
        await $store.dispatch("loansModule/registerReturn", { id });
        positiveMessage("Devolucion", "Se ha registrado una devolucion");
        rows.value = $store.state.loansModule.loans;
        isReturnDialogOpen.value = false;
      } catch (error) {
        negativeMessage("Error", "Ha ocurrido un error al registrar la devolucion");
      }
    }

    const filterClientesFn = async (val, update, abort) => {
      if (clientes.value !== null) {
        update();
        return;
      }

      await $store.dispatch("clientsModule/readClients");
      const allClients = [...$store.state.clientsModule.clients]
        .map((client) => `${client.id} ${client.name}`);

      update(() => {
        clientes.value = allClients;
      })
    }

    const abortFilterLibrosFn = () => {
      // console.log("Aborting filter libros...")
    }

    const abortFilterClientesFn = () => {
      // console.log("Aborting filter clients...")
    }

    // Returning reactive variables
    return {
      columns,
      clientes,
      clienteSelected,
      diasPrestamo,
      filter,
      isLoadingTable,
      isDarkModeActive,
      isRegisterDialogOpen,
      isReturnDialogOpen,
      libros,
      libroSelected,
      loanToReturnData,
      rows,
      filterLibrosFn,
      filterClientesFn,
      abortFilterLibrosFn,
      abortFilterClientesFn,
      onSubmit,
      onReset,
      onCancel,
      openRegisterDialog,
      openReturnDialog,
      returnLoan,
    }
  }
}

</script>

<style lang="scss" scoped>
@use "../css/table-pages.scss";
</style>
