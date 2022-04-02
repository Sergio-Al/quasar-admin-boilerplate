<template>
  <div class="column full-width">
    <q-card class="q-py-md">
      <q-card-section>
        <q-skeleton type="text" width="10rem" height="3.4rem" />
      </q-card-section>
      <q-item clickable v-ripple>
        <q-item-section top avatar>
          <q-skeleton type="QAvatar" size="2.5rem" />
        </q-item-section>
        <q-item-section>
          <q-skeleton type="text" width="9rem" height="30px" />
          <q-skeleton type="text" width="6rem" height="1rem" />
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section top avatar>
          <q-skeleton type="QAvatar" size="2.5rem" />
        </q-item-section>
        <q-item-section>
          <q-skeleton type="text" width="9rem" height="30px" />
          <q-skeleton type="text" width="6rem" height="1rem" />
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>
