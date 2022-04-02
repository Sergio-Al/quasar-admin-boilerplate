<template>
  <q-page class="flex q-py-xl q-px-xs items-start justify-center" padding>
    <div class="container fit">
      <div class="row">
        <div class="col-grow">
          <q-card class="my-card q-mx-auto">
            <q-card-section>
              <div class="text-h6">Informacion del Usuario</div>
            </q-card-section>
            <q-card-section>
              <div>
                <q-form
                  @submit="onSubmit"
                  class="q-gutter-md edit-form q-mx-auto q-mt-lg"
                >
                  <div class="row">
                    <div class="col-xs-12 col-sm-7 form-input">
                      <q-toggle
                        v-model="isEditingData"
                        color="primary"
                        keep-color
                        label="Modificar Datos"
                      />
                      <div class="custom-input">
                        <div class="text-h6">Nombre</div>
                        <q-input
                          v-model.trim="name"
                          type="text"
                          placeholder="Nombre"
                          :disable="!isEditingData"
                        />
                      </div>
                      <div class="custom-input">
                        <div class="text-h6">Correo Electrónico</div>
                        <q-input
                          v-model.trim="email"
                          type="email"
                          placeholder="Correo Electrónico"
                          :disable="!isEditingData"
                        />
                      </div>
                      <div class="custom-input">
                        <div class="text-h6">Rol</div>
                        <q-select
                          v-model.trim="role"
                          :options="roleOptions"
                          filled
                          :disable="!isEditingData"
                        />
                      </div>
                      <q-toggle
                        v-model="isEditingPassword"
                        color="primary"
                        keep-color
                        label="Modificar Contraseña"
                        class="q-mt-lg q-pa-none"
                        :disable="!isEditingData"
                      />
                      <div class="custom-input">
                        <div class="text-h6 text-weight-light">
                          Escriba su contraseña
                        </div>
                        <q-input
                          :disable="!isEditingPassword"
                          v-model.trim="newPassword"
                          type="password"
                          :hint="
                            !isEditingPassword
                              ? 'Desactivado: No se tomara en cuenta'
                              : ''
                          "
                          :rules="[
                            (val) =>
                              (val && val.length > 8) ||
                              'Ingresa una contraseña valida',
                          ]"
                        />
                      </div>
                      <div class="custom-input">
                        <div class="text-h6 text-weight-light">
                          Repite tu contraseña
                        </div>
                        <q-input
                          :disable="!isEditingPassword"
                          v-model.trim="repeatPassword"
                          type="password"
                          :hint="
                            !isEditingPassword
                              ? 'Desactivado: No se tomara en cuenta'
                              : ''
                          "
                          :rules="[
                            (val) =>
                              (val && val.length > 0 && val === newPassword) ||
                              'Las contraseñas no coinciden',
                          ]"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="flex row justify-end">
                    <q-btn
                      label="Guardar"
                      type="submit"
                      color="primary"
                      :disable="!isEditingData"
                    />
                  </div>
                </q-form>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { positiveMessage, negativeMessage } from "../composable/light-notify";

export default {
  setup() {
    const $q = useQuasar();
    const $store = useStore();

    const isEditingData = ref(false);
    const userData = ref(null);
    const name = ref(null);
    const email = ref(null);
    const roleOptions = ref(["ADMIN", "SUPERADMIN", "USER"]);
    const isLoading = ref(false);
    const role = ref(null);
    const newPassword = ref(null);
    const repeatPassword = ref(null);
    const isEditingPassword = ref(false);
    const isPasswordValueActive = ref(false);

    getCurrentUserData();

    watch(isEditingData, (newVal) => {
      if (!newVal) {
        name.value = userData.value.name;
        email.value = userData.value.mail;
        role.value = userData.value.role;

        isEditingPassword.value = isEditingPassword.value
          ? false
          : isEditingPassword.value;
      }
    });

    watch(isEditingPassword, (newVal) => {
      if (newVal) {
        resetPasswordInput();
      }
    });

    async function getCurrentUserData() {
      isLoading.value = true;
      try {
        await $store.dispatch("authModule/getUserProfile");
        setOriginalValues();
        isLoading.value = false;
      } catch (error) {
        negativeMessage("Error", "Ha ocurrido un error al capturar los datos");
      }
    }

    function setOriginalValues() {
      userData.value = $store.getters["authModule/getUserData"];
      name.value = userData.value.name;
      email.value = userData.value.mail;
      role.value = userData.value.role;
    }

    function resetPasswordInput() {
      newPassword.value = null;
      repeatPassword.value = null;
    }

    async function onSubmit() {
      const dataToSend = {
        name: name.value,
        email: email.value,
        role: role.value,
      };

      if (isEditingPassword.value) {
        dataToSend.password = newPassword.value;
      }

      isEditingData.value = false;

      try {
        await $store.dispatch("authModule/updateUserProfileData", dataToSend);
        await $store.dispatch("authModule/getUserProfile");
        setOriginalValues();
        positiveMessage("Éxito", "Sus datos fueron modificados correctamente");
      } catch (error) {
        negativeMessage("Error", "Hubo un error al modificar los datos");
      }

      console.log($store.state.authModule.userName);
    }
    // function of quasar framework, you can find this in the documentation.
    function myTweak(offset) {
      return { minHeight: offset ? `calc(100vh - ${offset}px` : "100vh" };
    }

    return {
      myTweak,
      name,
      email,
      roleOptions,
      role,
      newPassword,
      repeatPassword,
      isEditingData,
      isEditingPassword,
      isPasswordValueActive,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.my-card {
  min-width: 18rem;
  max-width: 55rem;
  width: 100%;
  .form-input {
    .custom-input {
      margin-top: 1 rem;
    }
  }
}
</style>
