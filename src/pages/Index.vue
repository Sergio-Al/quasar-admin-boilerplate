<template>
  <q-page class="q-pa-lg">
    <div class="flex justify-around">
      <div class="row">
        <div class="column">
          <div class="row no-wrap row-card">
            <card-info
              v-for="data in dataStadistics"
              :key="data"
              :iconName="data.icon"
              :valueAmount="data.amount"
              :valueName="data.name"
            />
          </div>
          <div class="row">
            <q-list bordered class="rounded-borders q-my-lg">
              <q-item-label header>Reportes</q-item-label>

              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">Brunch this weekend?</q-item-label>
                  <q-item-label caption lines="2">
                    <span class="text-weight-bold">Janet</span>
                    -- I'll be in your neighborhood doing errands this weekend.
                    Do you want to grab brunch?
                  </q-item-label>
                </q-item-section>

                <q-item-section side top> 1 min ago </q-item-section>
              </q-item>

              <q-separator inset="item" />

              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">Linear Project</q-item-label>
                  <q-item-label caption lines="2">
                    <span class="text-weight-bold">John</span>
                    -- Can we schedule a call for tomorrow?
                  </q-item-label>
                </q-item-section>

                <q-item-section side top> 1 min ago </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="column">
          <q-date class="q-mt-sm" v-model="dateToShow" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { date } from "quasar";
import { useStore } from "vuex";
import CardInfo from "../components/CardInfo.vue";

const cardData = [
  {
    icon: "people",
    amount: 34,
    name: "clientes",
  },
  {
    icon: "groups",
    amount: 5,
    name: "usuarios",
  },
  {
    icon: "notifications",
    amount: 2,
    name: "notificaciones",
  },
  {
    icon: "report",
    amount: 3,
    name: "reportes",
  },
];

export default defineComponent({
  name: "PageIndex",
  components: { CardInfo },
  setup() {
    const $store = useStore();
    const dateToShow = ref(getTodayDate());

    console.log(getTodayDate());
    function getTodayDate() {
      const currentTime = Date.now();
      const formattedTime = date.formatDate(currentTime, "YYYY/MM/DD");
      return formattedTime;
    }

    return {
      dataStadistics: cardData,
      dateToShow,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  max-width: 3840px;
}

@media screen and (max-width: 790px) {
  .row {
    justify-content: center;
  }
  .row-card {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
