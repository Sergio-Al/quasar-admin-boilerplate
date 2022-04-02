<template>
  <q-page class="q-pa-lg">
    <!-- Layout Page -->
    <div class="container">
      <div class="row">
        <div class="column">
          <h4>Clientes</h4>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <q-btn
            :outline="isDarkModeActive"
            color="primary"
            icon="person_add"
            label="Crear Nuevo"
            @click="openEditDialog()"
          />
        </div>
      </div>
      <div class="row">
        <div class="column custom-column">
          <div class="q-py-md user-table">
            <q-table
              title="Clients"
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
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
                  <q-td auto-width>
                    <q-btn
                      :outline="isDarkModeActive"
                      size="sm"
                      class="q-mx-xs"
                      color="info"
                      icon="edit"
                      round
                      @click="openEditDialog(props.row)"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      :outline="isDarkModeActive"
                      size="sm"
                      class="q-mx-xs"
                      color="accent"
                      icon="delete"
                      round
                      @click="openDeleteDialog(props.row)"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                    <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
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
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Ingresa los datos</div>
        </q-card-section>
        <q-card-section>
          <div>
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <q-input
                v-model="inputName"
                type="text"
                label="Nombre"
                class="q-mb-xs"
                outlined
                v-model.trim="inputName"
                :rules="[
                (val) => (val && val.toString().length > 0) || 'Ingresa un nombre',]"
              />
              <q-input
                v-model="inputEmail"
                type="email"
                label="E-Mail"
                class="q-mb-xs"
                outlined
                v-model.trim="inputEmail"
                :rules="[
                (val) => (val && val.toString().length > 0) || 'Ingresa un email',]"
              />
              <q-input
                v-model="inputCelular"
                type="text"
                label="Celular"
                class="q-mb-xs"
                outlined
                v-model.trim="inputCelular"
                :rules="[
                (val) => (val && val.toString().length > 0) || 'Ingresa un numero de celular',]"
              />

              <div class="flex column">
                <div class="q-mb-md">
                  <q-btn label="guardar" type="submit" color="primary" />
                  <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
                <div>
                  <q-btn color="primary" label="Cancelar" @click="onCancel" />
                </div>
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDeleteDialogOpen" persistent>
      <q-card>
        <q-card-section class="bg-accent text-white">
          <div class="text-h6">Eliminar id: {{ resourceForDelete.id }}</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="accent" text-color="white" />
          <span class="q-ml-sm">
            ¿Seguro que quieres eliminar a
            <span
              class="text-weight-bold"
            >{{ resourceForDelete.name }}</span>
            ?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Eliminar"
            color="accent"
            @click="onDeleteResource(resourceForDelete.id)"
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
import { positiveMessage, negativeMessage } from "src/composable/light-notify";
import { columnsForClients } from "src/composable/column-tables";

const columns = columnsForClients;

export default {
  setup() {
    // General variables
    const $store = useStore();
    const $q = useQuasar();

    // Table variables
    const rows = ref([]);
    const filter = ref("");
    const isLoadingTable = ref(false);

    // Dialogs
    let isDialogOpen = ref(false);
    let isDeleteDialogOpen = ref(false);
    let inputName = ref("");
    let inputEmail = ref("");
    let inputCelular = ref("");
    let dialogTitle = ref("");
    let resourceForUpdate = ref({});
    let resourceForDelete = ref({});
    let editDialogStatus = ref("");

    const isDarkModeActive = computed(() => $q.dark.isActive);

    // Get all data for the first time
    (async function setupClients() {
      isLoadingTable.value = true;
      try {
        await $store.dispatch("clientsModule/readClients");
        isLoadingTable.value = false;
        rows.value = $store.state.clientsModule.clients;
      } catch (e) {
        negativeMessage("Error", "Hubo un error al cargar los datos");
      }
    })();

    // Events in the page
    const openEditDialog = (data = null) => {
      isDialogOpen.value = !isDialogOpen.value;
      if (data) {
        inputName.value = data.name;
        inputEmail.value = data.email;
        inputCelular.value = data.celular;
        resourceForUpdate.value = data;
        dialogTitle.value = "Editar";
        editDialogStatus.value = "modify";
        return;
      }
      dialogTitle.value = "Crear Nuevo"
      editDialogStatus.value = "create";
    }
    const openDeleteDialog = (data) => {
      isDeleteDialogOpen.value = !isDeleteDialogOpen.value;
      resourceForDelete.value = data;
    }

    const onCancel = () => {
      onReset();
      isDialogOpen.value = !isDialogOpen.value;
    }

    const onSubmit = async () => {
      if (editDialogStatus.value === "create") {

        try {
          await $store.dispatch("clientsModule/createClient", {
            name: inputName.value,
            email: inputEmail.value,
            celular: inputCelular.value
          });
          positiveMessage("Creacion", "Se ha creado el recurso correctamente");
          rows.value = $store.state.clientsModule.clients;
          isDialogOpen.value = false;
          onReset();
        } catch (error) {

          negativeMessage("Error", "Hubo un error al crear el dato");
        }
      } else if (editDialogStatus.value === "modify") {

        try {
          await $store.dispatch(`clientsModule/updateClient`, {
            id: resourceForUpdate.value.id,
            name: inputName.value,
            email: inputEmail.value,
            celular: inputCelular.value
          });
          positiveMessage("Modificacion", "Se ha modificado el recurso");
          rows.value = $store.state.clientsModule.clients;
          isDialogOpen.value = false;
          onReset();
        } catch (error) {
          console.log(error);
          negativeMessage("Error", "Hubo un error en la actualizacion");
        }
      } else {
        return
      }
    }

    const onDeleteResource = async (id) => {
      try {
        await $store.dispatch("clientsModule/deleteClient", { id });
        positiveMessage("Eliminacion", "Se ha eliminado el recurso");
        rows.value = $store.state.clientsModule.clients;
        isDeleteDialogOpen.value = false;
      } catch (error) {
        negativeMessage("Error", "No se ha podido eliminar el recurso");
      }
    }

    const onReset = () => {
      inputName.value = "";
      inputCelular.value = "";
      inputEmail.value = "";
      resourceForUpdate.value = "";
    }

    // Returning reactive variables
    return {
      columns,
      dialogTitle,
      filter,
      inputName,
      inputEmail,
      inputCelular,
      isDarkModeActive,
      isDialogOpen,
      isDeleteDialogOpen,
      isLoadingTable,
      resourceForDelete,
      rows,
      onCancel,
      onReset,
      onSubmit,
      onDeleteResource,
      openEditDialog,
      openDeleteDialog,
    }
  }
}
</script>

<style lang="scss" scoped>
@use "../css/table-pages.scss";
</style>
