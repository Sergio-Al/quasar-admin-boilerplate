<template>
  <div class="fit q-pa-md">
    <q-layout>
      <q-page padding>
        <div class="main-page-custom">
          <div class="text-h2">Recuperar tu Cuenta</div>

          <div v-if="!submittedReset">
            <q-form @submit="onSubmit" class="q-gutter-md q-mt-lg">
              <p class="text-h6 text-weight-light">
                Ingresa tu correo electronico vinculado con la cuenta
              </p>
              <q-input
                v-model="email"
                type="email"
                label="Coreo Electronico"
                outlined
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Debes ingresar un correo',
                ]"
              />

              <div>
                <q-btn label="Enviar" type="submit" color="primary" />
              </div>
            </q-form>
          </div>
          <div v-else class="q-mt-md">
            <div class="text-h5">
              Se ha enviado las intrucctiones al correo {{ email }}. <br />
              Se dirigira a la pagina de Inicio de Sesión en 5 segundos
            </div>
          </div>
        </div>
      </q-page>
    </q-layout>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { positiveMessage, negativeMessage } from "../composable/light-notify";

export default {
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const isDarkModeActive = computed(() => $q.dark.isActive);

    const email = ref(null);
    const submittedReset = ref(false);

    async function onSubmit() {
      const dataToSend = { email: email.value };
      try {
        await $store.dispatch("authModule/recoverAccount", dataToSend);
        submittedReset.value = true;
        positiveMessage("Éxito", "Solicitud enviada");
        setTimeout(() => {
          $router.replace("/login");
        }, 5000);
      } catch (error) {
        negativeMessage(
          "Error",
          "Ha ocurrido un error al realizar la operacion"
        );
      }
    }
    return {
      isDarkModeActive,
      email,
      submittedReset,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.main-page-custom {
  max-width: 1023px;
  width: 100%;
  margin: 0 auto;
  .q-field {
    max-width: 510px;
  }
}
</style>
