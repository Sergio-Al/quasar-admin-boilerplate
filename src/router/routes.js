const routes = [
  {
    path: "/",
    redirect: "/system",
  },

  {
    path: "/system",
    name: "System",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "SystemMain",
        component: () => import("pages/Index.vue"),
      },
      {
        path: "authors",
        name: "SystemAuthors",
        component: () => import("pages/authors.vue"),
      },
      {
        path: "books",
        name: "SystemBooks",
        component: () => import("pages/Books.vue"),
      },
      {
        path: "clients",
        name: "SystemClients",
        component: () => import("pages/Clients.vue"),
      },
    ],
    // TODO: Delete this later
    // meta: {
    //   requiresAuth: true,
    // },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
