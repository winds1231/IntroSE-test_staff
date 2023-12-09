//Layouts
import { HeaderOnly } from "~/components/Layout";

import Home from "~/pages/Home";
import Search from "~/pages/Search";
import Sale from "~/pages/Sale";
import Profile from "~/pages/Profile";
import Upload from "~/pages/Upload";
import Login from "~/pages/Login";
import Storage from "~/pages/Storage";
import Invoice from "~/pages/Invoice";
import Revenue from "~/pages/Revenue";
import Staff from "~/pages/Staff";
import InsertStaff from "~/pages/insert-staff";
const publicRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/sale",
    component: Sale,
  },
  {
    path: "/:nickname",
    component: Profile,
  },
  {
    path: "/upload",
    component: Upload,
    layout: HeaderOnly,
  },
  {
    path: "/search",
    component: Search,
    layout: null,
  },
  {
    path: "/login",
    component: Login,
    layout: null,
  },
  {
    path: "/storage",
    component: Storage,
  },
  {
    path: "/invoice",
    component: Invoice,
  },
  {
    path: "/revenue",
    component: Revenue,
  },
  {
    path: "/staff",
    component: Staff,
  },
  {
    path: "/insert-staff",
    component: InsertStaff,
  }
];

const privateRoutes = [];
export { publicRoutes, privateRoutes };
