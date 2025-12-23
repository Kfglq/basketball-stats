// src/router/index_bak.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import _ from 'lodash';

const pages = import.meta.glob<false, string, any>('../pages/**/*.vue');
console.log(pages);
const routes: RouteRecordRaw[] = [];

_.map(pages, (physicalPath, path) => {
  const trimStartPath = _.replace(path, "../pages/", "");
  const splitPath = _.split(trimStartPath, "/");
  const moduleName = splitPath[0] || "";
  // 第一層
  if(splitPath.length === 1 && _.endsWith(moduleName, ".vue")) {
    const name = _.replace(moduleName, ".vue", "");
    routes.push({
      path: `/${_.toLower(name)}`,
      name: name,
      component: physicalPath
    })
  }
  // 第二層
  if(splitPath.length === 2) {
    const pageName = _.get(splitPath,"[1]","");
    if(_.endsWith(pageName, ".vue")) {
      const name = pageName === "index.vue" ? moduleName : _.replace(pageName, ".vue", "");
      routes.push({
        path: `/${_.toLower(name)}`,
        name: name,
        component: physicalPath
      })
    }
  }
})

// 4. 補上 404 Catch-all 路由 (捕獲所有未匹配的路徑)
routes.push({
    path: '/:catchAll(.*)', 
    name: 'NotFound',
    component: () => import('../utils/NotFound.vue')
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

console.log('Routes:', routes) // 檢查用

export default router
