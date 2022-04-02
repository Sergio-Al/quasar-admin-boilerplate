<template>
  <q-page class="q-pa-lg">
    <!-- Layout Page -->
    <div class="container">
      <div class="row">
        <div class="column">
          <h4>CLIENTES</h4>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <q-btn
            :outline="isDarkModeActive"
            :disable="loading"
            color="primary"
            class="create-button"
            icon="person_add"
            label="Crear Nuevo"
            @click="openEditDialog()"
          />
        </div>
      </div>
      <div v-if="loading" class="row">
        <div class="column custom-column">
          <table-data-skeleton />
        </div>
      </div>
      <div v-else class="row">
        <div class="column custom-column">
          <div class="q-py-md user-table">
            <q-table
              title="Clients"
              :rows="rows"
              :columns="columns"
              row-key="id"
              :filter="filter"
              :loading="loading"
              :rows-per-page-options="[10]"
            >
              <template v-slot:top>
                <q-space />
                <q-input
                  outlined
                  dense
                  label="Buscar"
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
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.value }}
                  </q-td>
                  <q-td auto-width>
                    <q-btn
                      :to="'clients/' + props.row.id"
                      :outline="isDarkModeActive"
                      size="sm"
                      class="q-mx-xs"
                      color="primary"
                      icon="folder"
                      round
                    >
                      <q-tooltip> Ver Contactos </q-tooltip>
                    </q-btn>
                    <q-btn
                      :outline="isDarkModeActive"
                      size="sm"
                      class="q-mx-xs"
                      color="info"
                      icon="edit"
                      round
                      @click="openEditDialog(props.row)"
                      v-if="$store.state.authModule.userRole !== 'USER'"
                    >
                      <q-tooltip> Editar </q-tooltip>
                    </q-btn>
                    <q-btn
                      :outline="isDarkModeActive"
                      size="sm"
                      class="q-mx-xs"
                      color="accent"
                      icon="delete"
                      round
                      @click="displayDeleteDialog(props.row.id)"
                      v-if="$store.state.authModule.userRole === 'SUPERADMIN'"
                    >
                      <q-tooltip> Eliminar </q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                    <div class="text-left">
                      This is expand slot for row above: {{ props.row.name }}.
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
    <!-- Dialogs -->
    <q-dialog v-model="isDialogOpen" persistent>
      <q-card class="creation-card-simple q-pa-sm">
        <q-card-section>
          <div class="text-h6">{{ titleDialog }}</div>
        </q-card-section>
        <q-card-section class="text-center">
          <div class="text-h6">Ingrese los datos</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
               <q-input
                class="q-mb-xs"
                :disable="isLoadingForm"
                v-model.trim="idField"
                type="text"
                outlined
                label="ID"
                :rules="[
                  (val) => (val && val.toString().length > 0) || 'Ingresa un ID',
                ]"
              />
              <q-input
                class="q-mb-xs"
                :disable="isLoadingForm"
                v-model.trim="nameField"
                type="text"
                outlined
                label="Nombre"
                :rules="[
                  (val) => (val && val.length > 0) || 'Ingresa un nombre',
                ]"
              />
              <q-input
                class="q-mb-xs"
                :disable="isLoadingForm"
                v-model.trim="nitField"
                type="number"
                outlined
                label="NIT"
              />
              <q-input
                class="q-mb-xs"
                :disable="isLoadingForm"
                v-model.trim="addressField"
                type="text"
                outlined
                label="Dirección"
                :rules="[
                  (val) => (val && val.length > 0) || 'Ingresa una Dirección',
                ]"
              />

              <div class="flex justify-between">
                <q-btn
                  label="Limpiar"
                  :disable="isLoadingForm"
                  type="reset"
                  color="primary"
                  flat
                  class="q-ml-sm"
                />
                <div>
                  <q-btn
                    class="q-mr-md"
                    :disable="isLoadingForm"
                    outline
                    color="primary"
                    label="Cancelar"
                    @click="cancelFormValue"
                  />
                  <q-btn
                    label="Guardar"
                    :disable="isLoadingForm"
                    type="submit"
                    color="primary"
                  />
                </div>
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isConfirmingDelete" persistent>
      <q-card>
        <q-card-section class="bg-accent text-white">
          <div class="text-h6">Eliminar id: {{ fetchedDataInfo.id }}</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="accent" text-color="white" />
          <span class="q-ml-sm">
            ¿Seguro que quieres eliminar a
            <span class="text-weight-bold">
              {{ fetchedDataInfo.name }}
            </span>
            ?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :disabled="isLoadingForm"
            label="Cancelar"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            :disabled="isLoadingForm"
            label="Eliminar"
            color="accent"
            @click="deleteClient(fetchedDataInfo.id)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { positiveMessage, negativeMessage } from "../composable/light-notify";
import { columnsForClients } from "../composable/column-tables";

import TableDataSkeleton from "../components/Skeletons/TableData.vue";

const columns = columnsForClients;

export default {
  components: { TableDataSkeleton },
  setup() {
    const $store = useStore();
    const $q = useQuasar();
    // test variables for table
    const loading = ref(false);
    const isLoadingForm = ref(false);
    const filter = ref("");
    const rowCount = ref(10);
    const rows = ref([]);
    // end test variables for table

    const titleDialog = ref("");
    const idField = ref("");
    const nameField = ref("");
    const nitField = ref(null);
    const addressField = ref("");
    const statusDialog = ref("");
    const idClientToUpdate = ref("");

    const fetchedDataInfo = ref({});
    const isConfirmingDelete = ref(false);
    const isDarkModeActive = computed(() => $q.dark.isActive);
    // console.log(store.state.generalModule.isDarkModeActive); //example of vuex store

    let isDialogOpen = ref(false);
    let addressTest = ref("");

    setupClients();

    async function setupClients() {
      loading.value = true;
      try {
        await $store.dispatch("clientsModule/requestAllClients");
        loading.value = false;
        rows.value = $store.state.clientsModule.clients;
      } catch (error) {
        negativeMessage("Error", "Hubo un error al cargar los datos");
      }
    }

    function displayDeleteDialog(clientIndex) {
      isConfirmingDelete.value = !isConfirmingDelete.value;
      captureDataFromIndex(clientIndex);
    }

    function captureDataFromIndex(index) {
      const clientData = rows.value.filter((row) => row.id == index)[0];
      fetchedDataInfo.value = { ...clientData };
    }

    async function deleteClient(idClient) {
      isLoadingForm.value = true;
      try {
        await $store.dispatch("clientsModule/deleteClient", { id: idClient });
        positiveMessage("Éxito", "Se ha eliminado correctamente");
        isLoadingForm.value = false;
        setupClients();
        isConfirmingDelete.value = !isConfirmingDelete.value;
      } catch (error) {
        negativeMessage("Error", "Ha ocurrido un error al eliminar el archivo");
        isLoadingForm.value = false;
      }
    }

    function openEditDialog(data) {
      isDialogOpen.value = !isDialogOpen.value;
      if (data) {
        titleDialog.value = `Modificar usuario ${data.id}`;
        idField.value = data.id;
        nameField.value = data.name;
        nitField.value = Number(data.nit);
        addressField.value = data.address;
        statusDialog.value = "modify";
        idClientToUpdate.value = data.id;
        captureDataFromIndex(data.id);
        return;
      }

      titleDialog.value = "Crear Nuevo Cliente";
      statusDialog.value = "create";
    }

    async function onSubmit() {
      isLoadingForm.value = true;
      if (statusDialog.value === "create") {
        try {
          await $store.dispatch("clientsModule/createClient", {
            id: idField.value,
            name: nameField.value,
            nit: Number(nitField.value),
            address: addressField.value,
          });
          positiveMessage("Éxito", "Se ha creado el dato correctamente");
          isLoadingForm.value = false;
          isDialogOpen.value = false;
          onReset();
          setupClients();
        } catch (error) {
          negativeMessage("Error", "Hubo un error al crear los datos");
          isLoadingForm.value = false;
          onReset();
        }
      } else if (statusDialog.value === "modify") {
        try {
          await $store.dispatch("clientsModule/modifyClient", {
            id: fetchedDataInfo.value.id,
            data: {
              id: idField.value,
              name: nameField.value,
              nit: Number(nitField.value),
              address: addressField.value,
            },
          });
          positiveMessage("Éxito", "Se actualizaron los datos correctamente");
          isLoadingForm.value = false;
          isDialogOpen.value = false;
          onReset();
          setupClients();
        } catch (error) {
          negativeMessage("Error", "Hubo un error al modificar los datos");
          isLoadingForm.value = false;
        }
      } else {
        return;
      }
    }

    function onReset() {
      idField.value = "";
      nameField.value = "";
      nitField.value = "";
      addressField.value = "";
    }

    function cancelFormValue() {
      onReset();
      isDialogOpen.value = false;
    }

    // function of quasar framework, you can find this in the documentation.
    function myTweak(offset) {
      return { minHeight: offset ? `calc(100vh - ${offset}px` : "100vh" };
    }

    return {
      myTweak,
      openEditDialog,
      displayDeleteDialog,
      onSubmit,
      onReset,
      deleteClient,
      cancelFormValue,

      isLoadingForm,
      isConfirmingDelete,
      fetchedDataInfo,
      isDarkModeActive,
      isDialogOpen,
      addressTest,
      titleDialog,
      idField,
      nameField,
      nitField,
      addressField,

      columns,
      rows,
      loading,
      filter,
      rowCount,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "../css/table-pages.scss";
</style>
