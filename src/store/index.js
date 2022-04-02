import { store } from "quasar/wrappers";
import { createStore } from "vuex";

// import example from './module-example'
import generalModule from "./general-module";
import authModule from "./auth-module";
import usersModule from "./users-module";
import clientsModule from "./clients-module";
import contactsModule from "./contacts-module";
import suppliersModule from "./suppliers-module";
import supplierContactsModule from "./supplierContacts-module";
import authorsModule from "./author-module";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      // example
      generalModule,
      authModule,
      usersModule,
      clientsModule,
      contactsModule,
      suppliersModule,
      supplierContactsModule,
      authorsModule,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
