<template>
  <q-page class="q-pa-lg">
    <div class="container">
      <div class="row">
        <div class="column">
          <h4>PROVEEDORES</h4>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <q-btn
            class="create-button"
            color="primary"
            icon="person_add"
            label="Crear Nuevo"
            :disable="loading"
            :outline="isDarkModeActive"
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
              row-key="id"
              title="Suppliers"
              :columns="columns"
              :filter="filter"
              :loading="loading"
              :rows="rows"
              :rows-per-page-option="[10]"
            >
              <template v-slot:top>
                <q-space />
                <q-input
                  color="primary"
                  debounce="300"
                  dense
                  label="Buscar"
                  outlined
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
                      class="q-mx-xs"
                      color="primary"
                      icon="folder"
                      round
                      size="sm"
                      :outline="isDarkModeActive"
                      :to="'suppliers/' + props.row.id"
                    >
                      <q-tooltip> Ver Contactos </q-tooltip>
                    </q-btn>
                    <q-btn
                      class="q-mx-sx"
                      color="info"
                      :outline="isDarkModeActive"
                      size="sm"
                      icon="edit"
                      round
                      v-if="$store.state.authModule.userRole !== 'USER'"
                      @click="openEditDialog(props.row)"
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
                      This is expand slot from row above: {{ props.row.name }}
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="isDialogOpen" persistent>
      <q-card class="creation-card-simple q-pa-dm">
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
                label="ID"
                outlined
                type="text"
                v-model.trim="idField"
                :disable="isLoadingForm"
                :rules="[
                  (val) =>
                    (val && val.toString().length > 0) || 'Ingresa un ID',
                ]"
              />
              <q-input
                class="q-mb-xs"
                outlined
                type="text"
                v-model.trim="nameField"
                label="Nombre"
                :disable="isLoadingForm"
                :rules="[
                  (val) => (val && val.length > 0) || 'Ingrese un nombre',
                ]"
              />
              <q-input
                class="q-mb-xs"
                label="NIT"
                outlined
                type="number"
                v-model.trim="nitField"
                :disable="isLoadingForm"
              />
              <q-input
                class="q-mb-xs"
                label="Dirección"
                outlined
                type="text"
                v-model.trim="addressField"
                :disable="isLoadingForm"
                :rules="[
                  (val) => (val && val.length > 0) || 'Ingresa una dirección',
                ]"
              />

              <div class="flex justify-between">
                <q-btn
                  class="q-ml-sm"
                  color="primary"
                  flat
                  label="Limpiar"
                  type="reset"
                  :disable="isLoadingForm"
                />
                <div>
                  <q-btn
                    class="q-mr-md"
                    color="primary"
                    label="Cancelar"
                    outline
                    :disable="isLoadingForm"
                    @click="cancelFormValue"
                  />
                  <q-btn
                    color="primary"
                    label="Guardar"
                    type="submit"
                    :disable="isLoadingForm"
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
            <span class="text-weight-bold"> {{ fetchedDataInfo.name }}</span>
            ?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            flat
            label="Cancelar"
            v-close-popup
            :disabled="isLoadingForm"
          />
          <q-btn
            flat
            :disabled="isLoadingForm"
            label="Eliminar"
            color="accent"
            @click="deleteSupplier(fetchedDataInfo.id)"
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
import { columnsForSuppliers } from "../composable/column-tables";

import TableDataSkeleton from "../components/Skeletons/TableData.vue";

const columns = columnsForSuppliers;

export default {
  components: { TableDataSkeleton },
  setup() {
    const $store = useStore();
    const $q = useQuasar();

    const loading = ref(false);
    const isLoadingForm = ref(false);
    const filter = ref("");
    const rowCount = ref(10);
    const rows = ref([]);

    const titleDialog = ref("");
    const idField = ref("");
    const nameField = ref("");
    const nitField = ref("");
    const addressField = ref("");
    const statusDialog = ref("");
    const idSupplierToUpdate = ref("");

    const fetchedDataInfo = ref({});
    const isConfirmingDelete = ref(false);
    const isDarkModeActive = computed(() => $q.dark.isActive);

    let isDialogOpen = ref(false);
    let addressTest = ref("");

    setupSuppliers();

    async function setupSuppliers() {
      loading.value = true;
      try {
        await $store.dispatch("suppliersModule/requestAllSuppliers");
        loading.value = false;
        rows.value = $store.state.suppliersModule.suppliers;
      } catch (error) {
        negativeMessage("Error", "Hubo un error al cargar los datos");
      }
    }

    function displayDeleteDialog(supplierIndex) {
      isConfirmingDelete.value = !isConfirmingDelete.value;
      captureDataFromIndex(supplierIndex);
    }

    function captureDataFromIndex(index) {
      const supplierData = rows.value.filter((row) => row.id == index)[0];
      fetchedDataInfo.value = { ...supplierData };
    }

    async function deleteSupplier(idSupplier) {
      isLoadingForm.value = true;
      try {
        await $store.dispatch("suppliersModule/deleteSupplier", {
          id: idSupplier,
        });
        positiveMessage("Éxito", "Se ha eliminado correctamente");
        isLoadingForm.value = false;
        setupSuppliers();
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
        idSupplierToUpdate.value = data.id;
        captureDataFromIndex(data.id);
        return;
      }

      titleDialog.value = "Crear Nuevo ";
      statusDialog.value = "create";
    }

    async function onSubmit() {
      isLoadingForm.value = true;
      if (statusDialog.value === "create") {
        try {
          await $store.dispatch("suppliersModule/createSupplier", {
            id: idField.value,
            name: nameField.value,
            nit: Number(nitField.value),
            address: addressField.value,
          });
          positiveMessage("Éxito", "Se ha creado el dato correctamente");
          isLoadingForm.value = false;
          isDialogOpen.value = false;
          onReset();
          setupSuppliers();
        } catch (error) {
          negativeMessage("Error", "Hubo un error al crear los datos");
          isLoadingForm.value = false;
          onReset();
        }
      } else if (statusDialog.value === "modify") {
        try {
          await $store.dispatch("suppliersModule/modifySupplier", {
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
          setupSuppliers();
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

    function myTweak(offset) {
      return { minHeight: offset ? `calc(100vh - ${offset}px` : "100vh" };
    }

    return {
      myTweak,
      openEditDialog,
      displayDeleteDialog,
      onSubmit,
      onReset,
      deleteSupplier,
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
