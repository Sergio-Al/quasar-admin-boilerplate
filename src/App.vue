<template>
  <router-view />
</template>
<script>
import { defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  setup() {
    const $q = useQuasar();
    // const $store = useStore();
    onMounted(() => {
      //  $store.dispatch("authModule/tryLoggin");
      if ($q.localStorage.getItem("isDarkMode")) {
        $q.dark.set($q.localStorage.getItem("isDarkMode"));
      }
      // setTimeout(() => {
      //   $q.dark.toggle();
      // }, 5000);
    });
  },
});
</script>
