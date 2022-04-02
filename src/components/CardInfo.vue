<template>
  <q-card clickable class="my-card flex flex-center" v-ripple>
    <div class="flex column flex-center items-center">
      <q-icon :name="icon" />
      <q-card-section class="flex column q-pa-none flex-center">
        <h5>{{ amount }}</h5>
        <p>{{ name }}</p>
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    iconName: {
      type: String,
      required: true,
    },
    valueAmount: {
      type: Number,
      required: true,
    },
    valueName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const icon = ref(props.iconName);
    const amount = ref(props.valueAmount);
    const name = ref(props.valueName);

    return {
      icon,
      amount,
      name,
    };
  },
};
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  height: auto;
  min-width: 180px;
  max-width: 200px;
  margin: 0.5rem 0.5rem;
  align-content: center;
  opacity: 54%;
  i {
    margin-top: 1rem;
    font-size: 6rem;
  }
  h5 {
    margin: 1rem;
    font-size: 2.5rem;
  }
  @media screen and (max-width: 667px) {
    margin: 0.2rem 0.25rem;
  }
}
</style>
