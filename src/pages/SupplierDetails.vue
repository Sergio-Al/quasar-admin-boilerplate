<template>
  <q-page padding>
    <div class="container">
      <div class="row">
        <div class="column">
          <h4>Detalles del Proveedor</h4>
        </div>
      </div>

      <div v-if="isLoadingSupplierData" class="row">
        <client-data-skeleton />
      </div>
      <div v-else class="row">
        <div class="column column-custom">
          <q-card class="my-card q-py-md">
            <q-card-section>
              <div class="text-h5">Nombre: {{ supplierName }}</div>
            </q-card-section>
            <q-item clickable v-ripple>
              <q-item-section top avatar>
                <q-icon
                  class="q-mx-auto q-my-auto info-client-icon"
                  name="assignment"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>NIT</q-item-label>
                <q-item-label caption lines="2">
                  {{ supplierNIT }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section top avatar>
                <q-icon
                  class="q-mx-auto q-my-auto info-client-icon"
                  name="business"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dirección</q-item-label>
                <q-item-label caption lines="2"
                  >{{ supplierAddress }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <q-btn
            class="create-button"
            color="primary"
            icon="person_add"
            label="Crear Nuevo"
            :disable="isLoadingSupplierData"
            :outline="isDarkModeActive"
            @click="onOpenEditDialog()"
          />
        </div>
      </div>
      <div v-if="isLoadingSupplierData" class="row">
        <div class="column column-custom">
          <contacts-client-data />
        </div>
      </div>
      <div v-else class="row q-my-md">
        <div class="column column-custom">
          <q-table
            row-key="id"
            title="Treats"
            :columns="columns"
            :filter="filter"
            :loading="loading"
            :rows="contactPerSupplierRow"
            :rows-per-page-options="[rowCount]"
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
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-th auto-width />
              <q-tr :props="props">
                <q-td>
                  <q-btn
                    color="info"
                    dense
                    round
                    size="sm"
                    :icon="props.expand ? 'remove' : 'add'"
                    @click="props.expand = !props.expand"
                  >
                    <q-tooltip> Mas Información</q-tooltip>
                  </q-btn>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
                <q-td
                  v-if="$store.state.authModule.userRole !== 'USER'"
                  auto-width
                >
                  <q-btn
                    class="q-mx-xs"
                    color="info"
                    icon="edit"
                    round
                    size="sm"
                    :outline="isDarkModeActive"
                    @click="onOpenEditDialog(props.row)"
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
                    v-if="$store.state.authModule.userRole === 'SUPERADMIN'"
                    @click="
                      onOpenDeleteDialog(
                        props.row.id,
                        `${props.row.name}
                       ${props.row.lastName}`
                      )
                    "
                  >
                  </q-btn>
                </q-td>
              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <div class="text-left q-ma-md">
                    <p>
                      <span class="text-weight-bold">Nombre: </span>
                      {{ props.row.name }} {{ props.row.lastName }}
                    </p>
                    <p>
                      <span class="text-weight-bold">Teléfono: </span>
                      {{ props.row.telephone }}
                    </p>
                    <p>
                      <span class="text-weight-bold">Posición: </span>
                      {{ props.row.position }}
                    </p>
                    <p>
                      <span class="text-weight-bold">Correo Electrónico: </span>
                      {{ props.row.email }}
                    </p>
                    <p>
                      <span class="text-weight-bold">Compañia: </span>
                      {{ props.row.company }}
                    </p>
                    <p>
                      <span class="text-weight-bold">Dirección 1: </span>
                      {{ props.row.addressOne }}
                    </p>
                    <p>
                      <span class="text-weight-bold">Dirección 2: </span>
                      {{ props.row.addressTwo }}
                    </p>
                    <p>
                      <span class="text-weight-bold">Ciudad: </span>
                      {{ props.row.city }}
                    </p>
                    <p>
                      <span class="text-weight-bold">Pais: </span>
                      {{ props.row.country }}
                    </p>
                    <p>
                      <span class="text-weight-bold">Dominio Web: </span>
                      {{ props.row.webDomain }}
                    </p>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </div>
    <q-dialog v-model="isModifyDialogOpen" persistent>
      <q-card class="creation-card-big q-pa-sm">
        <q-card-section>
          <div class="text-h6">Edición de Contacto</div>
        </q-card-section>
        <q-card-section class="text-center q-pa-none">
          <div class="text-h6">Ingrese los datos</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div>
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <div class="row">
                <div class="col-xs-12 col-sm-6 q-pr-xs">
                  <q-input
                    class="q-mb-xs"
                    label="Nombre"
                    type="text"
                    v-model.trim="nameContact"
                    :disable="isLoadingSupplierData"
                    :rules="[validateText]"
                  />
                </div>
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    class="q-mb-xs"
                    label="Apellidos"
                    type="text"
                    v-model.trim="lastNameContact"
                    :disable="isLoadingSupplierData"
                    :rules="[validateText]"
                  />
                </div>
              </div>

              <q-input
                class="q-mb-xs"
                label="Correo Electrónico"
                type="email"
                v-model.trim="emailContact"
                :disable="isLoadingSupplierData"
                :rules="[validateEmail]"
              />
              <q-input
                class="q-mb-xs"
                label="Compañia"
                type="text"
                v-model.trim="companyContact"
                :disable="isLoadingSupplierData"
                :rules="[validateText]"
              />
              <q-input
                class="q-mb-xs"
                label="Dirección"
                type="text"
                v-model.trim="addressOneContact"
                :disable="isLoadingSupplierData"
                :rules="[validateText]"
              />
              <q-input
                class="q-mb-xs"
                label="Dirección 2"
                type="text"
                v-model.trim="addressTwoContact"
                :disable="isLoadingSupplierData"
              />
              <div class="row">
                <div class="col-xs-12 col-sm-6 q-pr-xs">
                  <q-input
                    class="q-mb-xs"
                    hint="Formato: ##########"
                    label="Teléfono"
                    mask="##########"
                    unmasked-value
                    v-model.trim="telephoneContact"
                  />
                  <q-input
                    class="q-mb-xs"
                    label="Ciudad"
                    type="text"
                    v-model="cityContact"
                    :disable="isLoadingSupplierData"
                    :rules="[validateText]"
                  />
                  <q-input
                    class="q-mb-xs"
                    label="Pais"
                    type="text"
                    v-model="countryContact"
                    :disable="isLoadingSupplierData"
                    :rules="[validateText]"
                  />
                </div>
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    class="q-mb-xs"
                    label="Posición"
                    type="text"
                    v-model="positionContact"
                    :disable="isLoadingSupplierData"
                    :rules="[validateText]"
                  />
                  <q-input
                    class="q-mb-xs"
                    label="Dominio-Web"
                    type="text"
                    v-model="domainContact"
                    :disable="isLoadingSupplierData"
                    :rules="[validateText]"
                  />
                </div>
              </div>
              <div class="flex justify-between">
                <q-btn
                  class="q-ml-sm"
                  color="primary"
                  flat
                  label="limpiar"
                  type="reset"
                  :disable="isLoadingSupplierData"
                />
                <div>
                  <q-btn
                    class="q-mr-md"
                    color="primary"
                    label="Cancelar"
                    outline
                    :disable="isLoadingSupplierData"
                    @click="onCancel"
                  />
                  <q-btn
                    color="primary"
                    label="Guardar"
                    type="submit"
                    :disable="isLoadingSupplierData"
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
          <div class="text-h6">Eliminar Contacto {{ idToDelete }}</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="accent" text-color="white" />
          <span class="q-ml-sm">
            ¿Seguro que quiere eliminar a
            <span class="text-weight-bold">{{ nameContactToDelete }}?</span>
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            flat
            label="Cancelar"
            :disabled="isLoadingSupplierData"
            @click="onCloseDeleteDialog"
          />
          <q-btn
            color="primary"
            flat
            label="Eliminar"
            :disabled="isLoadingSupplierData"
            @click="onConfirmDeleteContact"
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
import {
  validateText,
  validateEmail,
  validateNumber,
} from "../composable/validation-input";
import { columnsForContacts } from "../composable/column-tables";

import ClientDataSkeleton from "../components/Skeletons/ClientData.vue";
import ContactsClientData from "../components/Skeletons/ContactsClientData.vue";

const columns = columnsForContacts;

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: { ClientDataSkeleton, ContactsClientData },
  setup(props) {
    const currentId = ref(props.id);
    const $q = useQuasar();
    const $store = useStore();

    const supplierName = ref("");
    const supplierNIT = ref("");
    const supplierAddress = ref("");
    const isLoadingSupplierData = ref(false);
    const loading = ref(false);
    const filter = ref("");
    const rowCount = ref(5);
    const contactPerSupplierRow = ref([]);
    const isModifyDialogOpen = ref(false);
    const dialogStatus = ref(null);

    const idContact = ref(null);
    const nameContact = ref(null);
    const lastNameContact = ref(null);
    const emailContact = ref(null);
    const companyContact = ref(null);
    const addressOneContact = ref(null);
    const addressTwoContact = ref(null);
    const telephoneContact = ref("");
    const cityContact = ref(null);
    const countryContact = ref(null);
    const positionContact = ref(null);
    const domainContact = ref(null);

    const isDeleteDialogOpen = ref(false);
    const idToDelete = ref(null);
    const nameContactToDelete = ref(null);

    const isDarkModeActive = computed(() => $q.dark.isActive);

    setupSupplierData();

    async function setupSupplierData() {
      isLoadingSupplierData.value = true;
      try {
        await $store.dispatch("suppliersModule/requestSupplier", {
          id: currentId.value,
        });

        await $store.dispatch(
          "supplierContactsModule/requestContactsPerSupplier",
          {
            id: currentId.value,
          }
        );

        isLoadingSupplierData.value = false;

        supplierName.value = $store.state.suppliersModule.selectedSupplierName;
        supplierNIT.value = $store.state.suppliersModule.selectedSupplierNIT;
        supplierAddress.value =
          $store.state.suppliersModule.selectedSupplierAddress;

        contactPerSupplierRow.value =
          $store.state.supplierContactsModule.contactsPerSupplier;
      } catch (error) {
        negativeMessage(
          "Error",
          "Hubo un error al cargar los datos del Proveedor"
        );
      }
    }

    function onOpenEditDialog(data) {
      if (data) {
        idContact.value = data.id;
        nameContact.value = data.name;
        lastNameContact.value = data.lastName;
        telephoneContact.value = data.telephone;
        positionContact.value = data.position;
        emailContact.value = data.email;
        companyContact.value = data.company;
        addressOneContact.value = data.addressOne;
        addressTwoContact.value = data.addressTwo;
        cityContact.value = data.city;
        countryContact.value = data.country;
        domainContact.value = data.webDomain;
        dialogStatus.value = "update";
        isModifyDialogOpen.value = !isModifyDialogOpen.value;
        return;
      }
      dialogStatus.value = "create";
      isModifyDialogOpen.value = !isModifyDialogOpen.value;
    }

    async function onSubmit() {
      let operation = null;
      let messageToDisplay = null;
      const dataToSubmit = {
        data: {
          name: nameContact.value,
          lastName: lastNameContact.value,
          telephone: telephoneContact.value,
          position: positionContact.value,
          email: emailContact.value,
          company: companyContact.value,
          addressOne: addressOneContact.value,
          addressTwo: addressTwoContact.value,
          city: cityContact.value,
          country: countryContact.value,
          webDomain: domainContact.value,
          ownerId: currentId.value,
        },
      };

      isLoadingSupplierData.value = true;
      if (dialogStatus.value === "create") {
        operation = "supplierContactsModule/createContactPerSupplier";
        messageToDisplay = "Se ha creado un nuevo contacto";
      } else if (dialogStatus.value === "update") {
        dataToSubmit.id = idContact.value;
        operation = "supplierContactsModule/updateContactPerSupplier";
        messageToDisplay = `Se ha modificado el contacto con id ${idContact.value}`;
      } else {
        return;
      }
      try {
        await $store.dispatch(operation, dataToSubmit);
        positiveMessage("Correcto", messageToDisplay);
        isLoadingSupplierData.value = false;
        isModifyDialogOpen.value = !isModifyDialogOpen.value;
        onReset();
        setupSupplierData();
        return;
      } catch (error) {
        console.log(error);
        negativeMessage(
          "Error",
          "Ha ocurrido un error al realizar la operación"
        );
        isLoadingSupplierData.value = false;
        return;
      }
    }

    function onReset() {
      idContact.value = null;
      nameContact.value = null;
      lastNameContact.value = null;
      emailContact.value = null;
      companyContact.value = null;
      addressOneContact.value = null;
      addressTwoContact.value = null;
      telephoneContact.value = null;
      positionContact.value = null;
      cityContact.value = null;
      countryContact.value = null;
      domainContact.value = null;
      dialogStatus.value = null;
    }

    function onCancel() {
      onReset();
      isModifyDialogOpen.value = !isModifyDialogOpen.value;
    }

    function onOpenDeleteDialog(id, name) {
      idToDelete.value = id;
      nameContactToDelete.value = name;
      isDeleteDialogOpen.value = !isDeleteDialogOpen.value;
    }

    function onCloseDeleteDialog() {
      isDeleteDialogOpen.value = !isDeleteDialogOpen.value;
      idToDelete.value = null;
      nameContactToDelete.value = null;
    }

    async function onConfirmDeleteContact() {
      isLoadingSupplierData.value = true;
      try {
        await $store.dispatch(
          "supplierContactsModule/deleteContactPerSupplier",
          {
            id: idToDelete.value,
          }
        );
        positiveMessage(
          "Correcto",
          `Se ha eliminado correctamente al usuario con ID ${idToDelete.value}`
        );
        isLoadingSupplierData.value = false;
        setupSupplierData();
        onCloseDeleteDialog();
      } catch (error) {
        negativeMessage(
          "Error",
          `No se ha podido eliminar el contacto ${idToDelete.value}`
        );
        isLoadingSupplierData.value = false;
      }
    }

    return {
      currentId,
      supplierName,
      supplierNIT,
      supplierAddress,
      isLoadingSupplierData,
      onOpenEditDialog,
      onSubmit,
      onReset,
      onCancel,
      isDarkModeActive,
      isModifyDialogOpen,

      onOpenDeleteDialog,
      isDeleteDialogOpen,
      onCloseDeleteDialog,
      idToDelete,
      nameContactToDelete,
      onConfirmDeleteContact,

      loading,
      filter,
      rowCount,
      columns,
      contactPerSupplierRow,

      validateText,
      validateEmail,
      validateNumber,

      nameContact,
      lastNameContact,
      emailContact,
      companyContact,
      addressOneContact,
      addressTwoContact,
      telephoneContact,
      cityContact,
      countryContact,
      positionContact,
      domainContact,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "../css/table-pages.scss";
.column-custom {
  width: 100%;
  max-width: 1440px;
  min-height: 171px;
  .my-card {
    height: 100%;
  }
  .info-client-icon {
    opacity: 54%;
  }
}
</style>
