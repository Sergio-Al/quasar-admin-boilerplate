<template>
  <div class="flex justify-center items-center window-height window-width main">
    <div
      class="my-login flex column justify-center items-center shadow-4 q-pa-sm"
    >
      <div class="">
        <img class="q-mb-sm" src="../assets/groupcisc-logo.png" />
      </div>

      <q-form @submit="onSubmit" class="flex column">
        <div class="q-mx-auto q-mb-md">
          <div class="text-h6">Iniciar Sesión</div>
        </div>
        <div class="form-input">
          <q-input
            v-model="emailText"
            type="email"
            label="Correo Electrónico"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Este campo no debe de estar vacio',
            ]"
          />
          <q-input
            v-model="passwordText"
            :type="isPwd ? 'password' : 'text'"
            label="Contraseña"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Este campo no debe estar vacio',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
        <div class="q-mt-lg">
          <q-btn
            :loading="isFormLoading"
            class="full-width"
            label="Ingresar"
            type="submit"
            color="primary"
          />
        </div>
        <div class="q-mt-sm">
          <p>
            ¿No tienes una cuenta?
            <router-link class="text-link" to="/sign-up"
              >Registrarse</router-link
            >
          </p>
          <p>
            ¿Olvido su contraseña?
            <router-link class="text-link" to="/recover">Recuperar</router-link>
          </p>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const isPwd = ref(true);
    const emailText = ref("");
    const passwordText = ref("");
    const isFormLoading = ref(false);

    async function onSubmit() {
      if (isFormLoading.value) {
        return;
      }
      isFormLoading.value = true;
      const dataToSend = {
        email: emailText.value,
        password: passwordText.value,
      };

      try {
        await $store.dispatch("authModule/logginUser", dataToSend);
        $q.notify({
          name: "Correcto",
          caption: "Los datos son correctos",
          color: "positive",
          icon: "check_circle",
        });
        $router.replace("/");
      } catch (error) {
        $q.notify({
          name: "Error",
          caption: `Hubo un error al iniciar sesion, revisa tus datos ${error.response.data}`,
          color: "negative",
          icon: "warning_amber",
        });
        isFormLoading.value = false;
      }
    }

    return {
      isPwd,
      emailText,
      passwordText,
      isFormLoading,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  background-color: rgb(241, 241, 255);
  .my-login {
    max-width: 330px;
    max-height: 514px;
    width: 100%;
    height: 100%;
    background-color: white;
    img {
      width: 98px;
    }
    .q-form {
      width: 80%;
      .form-input > * {
        margin: 0.5rem 0;
      }
      .text-link {
        text-decoration: none;
        color: black;
        &:hover {
          text-decoration: underline;
          font-weight: bold;
          color: $primary;
        }
      }
    }
  }
}

.body--dark {
  .main {
    background-color: rgb(18, 18, 18);
    .my-login {
      background-color: $dark;
      .q-form {
        background-color: $dark;
        .text-link {
          color: white;
        }
      }
    }
  }
}
</style>
