<template>
  <q-page class="q-pa-lg q-mx-auto" style="width: 100%">
    <div class="container">
      <div class="row">
        <div class="column">
          <h4>USUARIOS</h4>
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
              title="Users"
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
                  <q-td
                    v-if="$store.state.authModule.userRole === 'SUPERADMIN'"
                    auto-width
                  >
                    <q-btn
                      :outline="isDarkModeActive"
                      size="sm"
                      class="q-mx-xs"
                      color="primary"
                      icon="edit"
                      round
                      @click="openEditDialog(props.row)"
                    />
                    <q-btn
                      :outline="isDarkModeActive"
                      size="sm"
                      class="q-mx-xs"
                      color="accent"
                      icon="delete"
                      round
                      @click="openDeleteDialog(props.row)"
                    />
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
    <q-dialog v-model="isDialogOpen" persistent>
      <q-card class="creation-card-simple q-pa-sm">
        <q-card-section>
          <div class="text-h6">{{ titleDialog }}</div>
        </q-card-section>
        <q-card-section class="text-center">
          <div class="text-h6">Ingresa los datos</div>
        </q-card-section>
        <q-card-section>
          <div>
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <div class="q-mb-md">
                <q-input
                  class="q-mb-xs"
                  :disable="isLoadingForm"
                  v-model.trim="nameSelected"
                  type="text"
                  outlined
                  label="Nombre"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Ingresa un Nombre',
                  ]"
                />
                <q-input
                  class="q-mb-xs"
                  :disable="isLoadingForm"
                  v-model.trim="emailSelected"
                  type="email"
                  outlined
                  label="Correo Electrónico"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Ingresa un Correo Válido',
                  ]"
                />
                <q-select
                  outlined
                  :disable="isLoadingForm"
                  v-model="roleSelected"
                  :options="roleOptions"
                  label="Rol"
                />
              </div>
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
                    @click="closeEditDialog"
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
    <q-dialog v-model="isDeleteDialogOpen" persistent>
      <q-card>
        <q-card-section class="bg-accent text-white">
          <div class="text-h6">{{ titleDeleteDialog }}</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="accent" text-color="white" />
          <span class="q-ml-sm">
            ¿Seguro que quieres eliminar a
            <span class="text-weight-bold">
              {{ nameSelected }}
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
            @click="closeDeleteDialog"
          />
          <q-btn
            flat
            :disabled="isLoadingForm"
            label="Eliminar"
            color="accent"
            @click="deleteUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { columnsForUsers } from "../composable/column-tables";

import TableDataSkeleton from "../components/Skeletons/TableData.vue";
import { negativeMessage, positiveMessage } from "../composable/light-notify";

const columns = columnsForUsers;

export default {
  components: { TableDataSkeleton },
  setup() {
    const $q = useQuasar();
    const $store = useStore();

    const loading = ref(false);
    const isLoadingForm = ref(false);
    const filter = ref("");
    const rowCount = ref(10);
    const rows = ref([]);
    const isDarkModeActive = computed(() => $q.dark.isActive);
    const isDialogOpen = ref(false);
    const addressTest = ref("");

    const titleDialog = ref(null);
    const titleDeleteDialog = ref(null);
    const roleOptions = ref(["ADMIN", "SUPERADMIN", "USER"]);
    const idSelected = ref(null);
    const roleSelected = ref(null);
    const nameSelected = ref(null);
    const emailSelected = ref(null);
    const isDeleteDialogOpen = ref(false);

    getUserData();

    async function getUserData() {
      loading.value = true;
      try {
        await $store.dispatch("usersModule/requestUsersData");
        loading.value = false;
        rows.value = $store.state.usersModule.users;
      } catch (error) {
        $q.notify({
          name: "Error",
          caption: `Ha ocurrido un error al cargar los datos ${error.response}`,
          color: "negative",
          icon: "warning_amber",
        });
      }
    }
    // function of quasar framework, you can find this in the documentation.
    function myTweak(offset) {
      return { minHeight: offset ? `calc(100vh - ${offset}px` : "100vh" };
    }

    function openEditDialog(data) {
      titleDialog.value = "Modificar Usuario: " + data.id;
      idSelected.value = data.id;
      nameSelected.value = data.name;
      emailSelected.value = data.email;
      roleSelected.value = data.role;
      isDialogOpen.value = !isDialogOpen.value;
    }

    function openDeleteDialog(data) {
      titleDeleteDialog.value = "Eliminar Usuario: " + data.id;
      idSelected.value = data.id;
      nameSelected.value = data.name;
      isDeleteDialogOpen.value = !isDeleteDialogOpen.value;
    }

    function closeEditDialog() {
      isDialogOpen.value = !isDialogOpen.value;
      onReset();
    }

    function closeDeleteDialog() {
      isDeleteDialogOpen.value = !isDeleteDialogOpen.value;
      onReset();
    }

    function onReset() {
      titleDialog.value = null;
      titleDeleteDialog.value = null;
      idSelected.value = null;
      roleSelected.value = null;
      nameSelected.value = null;
      emailSelected.value = null;
    }

    async function onSubmit() {
      isLoadingForm.value = true;
      try {
        await $store.dispatch("usersModule/updateUserData", {
          id: idSelected.value,
          name: nameSelected.value,
          email: emailSelected.value,
          role: roleSelected.value,
        });
        positiveMessage("Éxito", "Se modificaron los datos para el usuario");
        isLoadingForm.value = false;
        isDialogOpen.value = false;
        onReset();
        getUserData();
      } catch (error) {
        negativeMessage("Error", "Hubo un error al actualizar los datos");
        isLoadingForm.value = false;
      }
    }

    async function deleteUser() {
      isLoadingForm.value = true;
      try {
        await $store.dispatch("usersModule/deleteUserData", {
          id: idSelected.value,
        });
        positiveMessage(
          "Éxito",
          `Se eliminó al usuario ${idSelected.value} correctamente`
        );
        isLoadingForm.value = false;
        isDeleteDialogOpen.value = false;
        onReset();
        getUserData();
      } catch (error) {
        negativeMessage("Error", "Hubo un error al eliminar al usuario");
        isLoadingForm.value = false;
      }
    }

    return {
      isDialogOpen,
      isDeleteDialogOpen,
      isDarkModeActive,
      addressTest,

      titleDialog,
      titleDeleteDialog,
      isLoadingForm,
      roleOptions,
      roleSelected,
      nameSelected,
      emailSelected,

      myTweak,
      openEditDialog,
      openDeleteDialog,
      closeEditDialog,
      closeDeleteDialog,
      onReset,
      onSubmit,
      deleteUser,

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
@use '../css/table-pages';
</style>
