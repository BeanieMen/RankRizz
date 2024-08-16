import { _ as __nuxt_component_0, a as __nuxt_component_1, b as __nuxt_component_2 } from './NuxtRating-o8Okvodf.mjs';
import { defineComponent, ref, withAsyncContext, watch, mergeProps, withCtx, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useCookie } from './client-only-UjP8Ct3o.mjs';
import './server.mjs';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'cron';
import 'fs/promises';
import 'crypto';
import 'promised-sqlite3';
import 'sqlite3';
import 'dotenv';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'consola/core';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b, _c, _d;
    let __temp, __restore;
    const passKey = useCookie("passKey").value;
    const pageRef = ref(1);
    const user = ref(null);
    const rating = ref(1);
    const imageIds = ref([]);
    const comments = ref([]);
    const uploadError = ref(null);
    const uploadSuccess = ref(false);
    const images = [];
    let starRatingTotal = 0;
    const response = ([__temp, __restore] = withAsyncContext(() => $fetch(`/api/user/${passKey}`)), __temp = await __temp, __restore(), __temp);
    if ("data" in response) {
      user.value = response.data.user;
      rating.value = (_a = response.data.starRatingAverages[pageRef.value - 1]) != null ? _a : 0;
      imageIds.value = (_b = response.data.imageIds) != null ? _b : [];
      starRatingTotal = (_c = response.data.starRatingTotals[pageRef.value - 1]) != null ? _c : 0;
      comments.value = (_d = response.data.comments[pageRef.value - 1]) != null ? _d : [];
      imageIds.value.forEach((v) => {
        var _a2;
        images.push(`/user-photos/${(_a2 = user.value) == null ? void 0 : _a2.id}/id_${v}.webp`);
      });
    }
    watch(pageRef, (newPage) => {
      var _a2, _b2, _c2;
      if ("data" in response) {
        rating.value = (_a2 = response.data.starRatingAverages[newPage - 1]) != null ? _a2 : 0;
        starRatingTotal = (_b2 = response.data.starRatingTotals[newPage - 1]) != null ? _b2 : 0;
        comments.value = (_c2 = response.data.comments[newPage - 1]) != null ? _c2 : [];
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2;
      const _component_UCarousel = __nuxt_component_0;
      const _component_UButton = __nuxt_component_1;
      const _component_NuxtRating = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center bg-background h-screen py-10 px-5" }, _attrs))}><div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl text-black flex flex-col items-center my-auto"><div class="flex flex-col md:grid md:grid-cols-2 md:gap-x-10 w-full"><div class="flex flex-col mb-6 md:mb-0"><div class="text-center mb-6"><h1 class="text-2xl md:text-3xl font-semibold mb-2"> User Profile </h1><p> Manage your profile information and upload photos. </p></div><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_UCarousel, {
        items: images,
        ui: {
          item: "basis-full",
          container: "rounded-lg",
          indicators: {
            wrapper: "relative bottom-0 mt-4"
          }
        },
        indicators: "",
        class: "w-full md:w-64 mx-auto"
      }, {
        default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", item)} class="w-full" draggable="false"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: item,
                class: "w-full",
                draggable: "false"
              }, null, 8, ["src"])
            ];
          }
        }),
        indicator: withCtx(({ onClick, page, active }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              label: String(page),
              variant: active ? "solid" : "outline",
              size: "2xs",
              class: "rounded-full min-w-6 justify-center",
              onClick: ($event) => {
                pageRef.value = page;
                onClick(page);
              }
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                label: String(page),
                variant: active ? "solid" : "outline",
                size: "2xs",
                class: "rounded-full min-w-6 justify-center",
                onClick: ($event) => {
                  pageRef.value = page;
                  onClick(page);
                }
              }, null, 8, ["label", "variant", "onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (imageIds.value.length < 3) {
        _push(`<div class="text-center mt-6"><label for="file-upload" class="block text-lg font-medium mb-2"> Upload Photos: </label><input id="file-upload" type="file" class="block w-full border border-gray-300 rounded-lg p-2" accept=".jpeg, .jpg, .png, .webp"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-gray-100 p-4 rounded-lg shadow-inner"><p><strong>ID:</strong> ${ssrInterpolate((_a2 = user.value) == null ? void 0 : _a2.id)}</p><p><strong>Username:</strong> ${ssrInterpolate((_b2 = user.value) == null ? void 0 : _b2.username)}</p></div><div class="flex flex-col items-center mt-4"><h2 class="text-lg font-semibold mb-2"> RizzRates (${ssrInterpolate(unref(starRatingTotal))} reviews) </h2>`);
      _push(ssrRenderComponent(_component_NuxtRating, {
        "read-only": true,
        "rating-size": 24,
        "rating-value": rating.value,
        "border-color": "#db8403",
        "active-color": "#ffa41c",
        "inactive-color": "#fff",
        "rating-step": 0.5,
        "rounded-corners": true,
        "rating-level": 10,
        "rating-count": 10,
        "border-width": 5
      }, null, _parent));
      _push(`<h3 class="text-md mb-2">${ssrInterpolate(rating.value.toFixed(2))} out of 10 stars </h3></div><div class="mt-4">`);
      if (uploadError.value) {
        _push(`<div class="text-center text-red-500"> Error: ${ssrInterpolate(uploadError.value)}</div>`);
      } else if (uploadSuccess.value) {
        _push(`<div class="text-center text-green-500"> Images uploaded successfully! </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="bg-gray-100 p-4 rounded-lg shadow-inner w-full my-auto h-[90vh] max-h-[40rem] overflow-y-auto"><h2 class="text-xl text-center font-bold mb-4"> RizzViews </h2><div class="space-y-4"><!--[-->`);
      ssrRenderList(comments.value, (comment, index) => {
        _push(`<div class="p-4 bg-white rounded-lg shadow"><p>${ssrInterpolate(comment)}</p></div>`);
      });
      _push(`<!--]--></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DVLTlDW1.mjs.map
