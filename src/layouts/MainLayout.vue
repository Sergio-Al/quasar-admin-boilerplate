<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Layout -->
    <q-header elevated>
      <q-toolbar class="q-px-md q-py-xs">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-weight-medium q-px-md q-pr-lg">Library App</q-toolbar-title>

        <div>
          <img class="img-logo" src="../assets/groupcisc-logo.png" alt />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="256"
      show-if-above
      bordered
      content-class="bg-secondary"
    >
      <div class="absolute-top text-secondary" style="box-sizing: border-box; height: 144px">
        <div class="absolute-bottom bg-transparent flex column q-py-md q-px-lg">
          <q-avatar size="40px" class="q-mb-sx">
            <q-icon :name="userIcon" class="avatar-icon" style="font-size: 2.5rem" />
          </q-avatar>
          <div class="text-weight-bold title" style="font-size: 20px; margin-top: 20px">
            Usuario
            <q-tooltip :delay="1000">Administrador</q-tooltip>
          </div>
          <div class="text-caption role-text">User</div>
        </div>
      </div>
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 144px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-separator />
          <q-item
            to="/system"
            clickable
            :active="isMyComponent('principal')"
            @click="selectComponent('principal')"
            active-class="item-active"
            v-ripple
            exact
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>

            <q-item-section>Principal</q-item-section>
          </q-item>

          <q-item
            to="/system/users"
            clickable
            :active="isMyComponent('usuarios')"
            @click="selectComponent('usuarios')"
            active-class="item-active"
            v-ripple
            exact
            v-if="$store.state.authModule.userRole !== 'USER'"
          >
            <q-item-section avatar>
              <q-icon name="assignment" />
            </q-item-section>

            <q-item-section>Usuarios</q-item-section>
          </q-item>

          <q-item
            to="/system/authors"
            clickable
            :active="isMyComponent('autores')"
            @click="selectComponent('autores')"
            v-ripple
            exact
          >
            <q-item-section avatar>
              <q-icon name="account_box" />
            </q-item-section>

            <q-item-section>Autores</q-item-section>
          </q-item>

          <q-item
            to="/system/clients"
            clickable
            :active="isMyComponent('clientes')"
            @click="selectComponent('clientes')"
            active-class="item-active"
            v-ripple
            exact
          >
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>

            <q-item-section>clientes</q-item-section>
          </q-item>

          <q-item
            to="/system/suppliers"
            clickable
            :active="isMyComponent('proveedores')"
            @click="selectComponent('proveedores')"
            active-class="item-active"
            v-ripple
            exact
          >
            <q-item-section avatar>
              <q-icon name="hail" />
            </q-item-section>

            <q-item-section>proveedores</q-item-section>
          </q-item>
          <q-separator spaced />

          <q-item-label header>Opciones</q-item-label>

          <q-item
            to="/system/options"
            clickable
            :active="isMyComponent('opciones')"
            @click="selectComponent('opciones')"
            active-class="item-active"
            v-ripple
            exact
          >
            <q-item-section avatar>
              <q-icon name="account_box" />
            </q-item-section>

            <q-item-section>Perfil</q-item-section>
          </q-item>

          <q-expansion-item expand-separator icon="settings" label="Opciones">
            <q-card>
              <q-card-section class="q-ma-none">
                <div class="column wrap q-pa-none justify-center">
                  <div class="row">
                    <q-toggle
                      v-model="isNightMode"
                      checked-icon="dark_mode"
                      size="lg"
                      :label="isNightMode ? 'Modo Noche: Si' : 'Modo Noche: No'"
                      unchecked-icon="light_mode"
                    />
                  </div>

                  <div class="row items-center q-mt-lg">
                    <q-icon size="xl" name="person_outline" />

                    <div class="column q-ml-lg">
                      <div class="text-subtitle1 q-mt-md q-mb-xs">{{ userName }}</div>

                      <q-btn
                        color="primary"
                        label="Cerrar Sesión"
                        push
                        size="sm"
                        @click="onLogoutDialog"
                      />
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Dialogs -->
    <q-dialog v-model="isLogoutDialogOpen" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="logout" color="primary" text-color="white" />
          <span class="q-ml-sm">¿Estas seguro de cerrar la sesión?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="primary" v-close-popup />
          <q-btn outline label="Cerrar Sesión" color="primary" @click="onLogout" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

//
<script>
// import EssentialLink from "components/EssentialLink.vue";

import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { notifyMessage, getTokenFromStorage } from "../composable/utils";
import { positiveMessage, negativeMessage } from "../composable/light-notify";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const isNightMode = ref($q.dark.isActive);
    const leftDrawerOpen = ref(false);
    const componentSelected = ref("principal");
    const isLogoutDialogOpen = ref(false);

    const isMyComponent = (componentName) =>
      componentName === componentSelected.value;

    watch(isNightMode, (newValue) => {
      $q.dark.set(newValue);
      $q.localStorage.set("isDarkMode", newValue);
    });

    // verifyValidSession();

    async function verifyValidSession() {
      try {
        await $store.dispatch("authModule/getUserProfile");
      } catch (error) {
        if (error.response.status === 401) {
          $q.localStorage.clear();
          negativeMessage("Error", "Problema de autenticación");
          $router.replace("/login");
          return;
        }
        negativeMessage("Error", "Ha ocurrido un error al cargar los datos");
      }
    }

    function selectComponent(componentName) {
      componentSelected.value = componentName;
    }

    function onLogoutDialog() {
      isLogoutDialogOpen.value = !isLogoutDialogOpen.value;
    }

    async function onLogout() {
      try {
        await $store.dispatch("authModule/logout");
        $router.replace("/login");
      } catch (error) {
        negativeMessage(
          "Error",
          "Ha ocurrido un error al realizar la operación"
        );
      }
    }

    return {
      isNightMode,
      leftDrawerOpen,
      isLogoutDialogOpen,
      onLogoutDialog,
      onLogout,
      selectComponent,
      isMyComponent,
      userName: computed(() => $store.getters["authModule/getUserName"]),
      userRole: computed(() => $store.getters["authModule/getUserRole"]),
      userMail: computed(() => $store.getters["authModule/getUserMail"]),
      userIcon: computed(() =>
        $store.getters["authModule/getUserRole"] === "SUPERADMIN"
          ? "admin_panel_settings"
          : $store.getters["authModule/getUserRole"] === "ADMIN"
            ? "assignment_ind"
            : "person"
      ),
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style lang="scss" scoped>
* {
  transition: 0.1s all ease-in;
}

.role-text {
  color: black;
}

.avatar-icon {
  color: black;
}

.q-toolbar {
  background-color: $secondary;
  color: black;
  .img-logo {
    height: 3rem;
  }
}

.q-drawer {
  .title {
    color: black;
    cursor: default;
  }
  .q-list {
    padding: 0 0.4rem;
    .q-item {
      i {
        opacity: 54%;
      }
    }
    .q-item__section {
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.item-active {
  background-color: #e3f2fd;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0 1rem;
  opacity: 100%;
  color: $primary;
  i {
    opacity: 100%;
    color: $primary;
  }
}

.body--dark {
  .role-text {
    color: white;
  }

  .avatar-icon {
    color: white;
  }

  .q-drawer {
    .title {
      color: $primary-dark-text;
    }
  }

  .item-active {
    background-color: $bg-dark-third;
    color: $primary-dark;
    i {
      color: $secondary-dark;
    }
  }
  .q-toolbar {
    background-color: $bg-dark-primary;
    color: $secondary;
  }
}
</style>
