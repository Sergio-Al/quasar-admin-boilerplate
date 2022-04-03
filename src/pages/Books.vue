<template>
  <q-page class="q-pa-lg">
    <!-- Layout Page -->
    <div class="container">
      <div class="row">
        <div class="column">
          <h4>Libros</h4>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <q-btn
            :outline="isDarkModeActive"
            color="primary"
            class="create-button"
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
              title="Authors"
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
                      size="sm"
                      color="info"
                      class="q-mx-xs"
                      round
                      @click="props.expand = !props.expand"
                      :icon="props.expand ? 'remove' : 'add'"
                    >
                      <q-tooltip>Mas Informacion</q-tooltip>
                    </q-btn>
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
                    <div class="text-left">
                      <strong>Descripción:</strong>
                      {{ props.row.description }}.
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
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Ingresa los datos</div>
        </q-card-section>
        <q-card-section>
          <div>
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <q-input
                v-model="inputTitulo"
                type="text"
                label="Nombre"
                class="q-mb-xs"
                outlined
                v-model.trim="inputTitulo"
                :rules="[
                (val) => (val && val.toString().length > 0) || 'Ingresa un titulo',]"
              />

              <q-select
                filled
                v-model="authorSelected"
                use-chips
                :label="editDialogStatus === 'modify' ? `Modificar: ${authorSelected}` : 'Selecciona un autor'"
                :hint="editDialogStatus === 'modify' ? 'Selecciona una opcion para modificar el autor' : ''"
                :options="authors"
                @filter="filterFn"
                @filter-abort="abortFilterFn"
                style="width: 250px"
                :rules="[
                (val) => (val && val.toString().length > 0) || 'Selecciona un autor',]"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">No results</q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                v-model="inputLote"
                type="text"
                label="Lote"
                class="q-mb-xs"
                outlined
                v-model.trim="inputLote"
                :rules="[
                (val) => (val && val.toString().length > 0) || 'Ingresa un codigo de lote',]"
              />

              <q-input
                v-model="inputDescription"
                type="text"
                label="Descripcion"
                class="q-mb-xs"
                outlined
                v-model.trim="inputDescription"
                :rules="[
                (val) => (val && val.toString().length > 0) || 'Ingresa una descripcion',]"
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
            >{{ resourceForDelete.titulo }}</span>
            ?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Eliminar" color="accent" @click="onDeleteBook(resourceForDelete.id)" />
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
import { columsnForBooks } from "../composable/column-tables";

const columns = columsnForBooks;

export default {
  setup() {
    // General Variables
    const $store = useStore();
    const $q = useQuasar();

    // Table variables
    const rows = ref([]);
    const filter = ref("");
    const isLoadingTable = ref(false);

    // Dialogs
    let isDialogOpen = ref(false);
    let isDeleteDialogOpen = ref(false);
    let inputTitulo = ref("");
    let authors = ref(null);
    let authorSelected = ref(null);
    let inputLote = ref("");
    let inputDescription = ref("");
    let dialogTitle = ref("");
    let editDialogStatus = ref("");
    let resourceForUpdate = ref({});
    let resourceForDelete = ref({});

    const isDarkModeActive = computed(() => $q.dark.isActive);

    // GEt all data for the first render
    (async function setupBooks() {
      isLoadingTable.value = true;
      try {
        await $store.dispatch("booksModule/readBooks");
        isLoadingTable.value = false;
        rows.value = $store.state.booksModule.books;
      } catch (e) {
        negativeMessage("Error", "Hubo un error al cargar los datos");
      }
    })()

    // Events in the page
    const openEditDialog = (data = null) => {
      isDialogOpen.value = !isDialogOpen.value;
      if (data) {
        dialogTitle.value = "Editar"
        inputTitulo.value = data.titulo;
        authorSelected.value = `${data.autor_id} ${data.nombre_autor}`;
        inputLote.value = data.lote;
        inputDescription.value = data.description;
        editDialogStatus.value = "modify";
        resourceForUpdate.value = data;
        return;
      }
      dialogTitle.value = "Crear Nuevo";
      editDialogStatus.value = "create";
    }

    const openDeleteDialog = (data) => {
      isDeleteDialogOpen.value = !isDeleteDialogOpen.value;
      resourceForDelete.value = data
    }

    const onDeleteBook = async (id) => {
      try {
        await $store.dispatch("booksModule/deleteBook", { id });
        positiveMessage("Eliminacion", "Se ha modificado el recurso");
        rows.value = $store.state.booksModule.books;
        isDeleteDialogOpen.value = false;
      } catch (error) {
        negativeMessage("Error", "No se ha podido eliminar el recurso");
      }
    }

    const onCancel = () => {
      onReset();
      isDialogOpen.value = !isDialogOpen.value;
    }

    const onSubmit = async () => {
      if (editDialogStatus.value === "create") {
        try {
          await $store.dispatch("booksModule/createBook", {
            titulo: inputTitulo.value,
            autor_id: Number(authorSelected.value.split(" ")[0]),
            lote: inputLote.value,
            description: inputDescription.value
          });
          positiveMessage("Creacion", "Se ha creado un nuevo recurso");
          rows.value = $store.state.booksModule.books;
          isDialogOpen.value = false;
          onReset();
        } catch (error) {
          negativeMessage("Error", "Hubo un error al crear el recurso");
        }
      } else if (editDialogStatus.value === 'modify') {
        try {
          await $store.dispatch("booksModule/updateBook", {
            id: resourceForUpdate.value.id,
            titulo: inputTitulo.value,
            autor_id: Number(authorSelected.value.split(" ")[0]),
            lote: inputLote.value,
            description: inputDescription.value,
          })
          positiveMessage("Creacion", "Se ha creado un nuevo recurso");
          rows.value = $store.state.booksModule.books;
          isDialogOpen.value = false;
          onReset();
        } catch (error) {
          negativeMessage("Error", "hubo un error al modificar el recurso");
        }
      } else {
        return;
      }
    }

    const onReset = () => {
      inputTitulo.value = "";
      authorSelected.value = null;
      inputLote.value = "",
        inputDescription.value = "";
    }

    const filterFn = async (val, update, abort) => {
      if (authors.value !== null) {
        update();
        return;
      }

      await $store.dispatch("authorsModule/readAuthors");
      const allAuthors = [...$store.state.authorsModule.authors]
        .map((author) => `${author.id} ${author.name}`);

      update(() => {
        authors.value = allAuthors;
      })
    }

    const abortFilterFn = () => {
      // console.log("Aborting filter...");
    }

    // Return reactive variables
    return {
      authors,
      authorSelected,
      columns,
      dialogTitle,
      editDialogStatus,
      filter,
      inputTitulo,
      inputLote,
      inputDescription,
      isDarkModeActive,
      isDeleteDialogOpen,
      isDialogOpen,
      isLoadingTable,
      resourceForDelete,
      rows,
      abortFilterFn,
      filterFn,
      onCancel,
      onReset,
      onSubmit,
      openEditDialog,
      onDeleteBook,
      openDeleteDialog,
    }
  }
}
</script>

<style lang="scss" scoped>
@use "../css/table-pages.scss";
</style>
