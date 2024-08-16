import { _ as __nuxt_component_0, a as __nuxt_component_1, b as __nuxt_component_2 } from './NuxtRating-o8Okvodf.mjs';
import { useSSRContext, defineComponent, ref, withAsyncContext, mergeProps, withCtx, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { useThrottleFn } from '@vueuse/core';
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
import 'tailwind-merge';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Feed",
  __ssrInlineRender: true,
  props: {
    imagePaths: {},
    imageIds: {},
    randomUser: {}
  },
  setup(__props) {
    const pageRef = ref(1);
    const rating = ref(0);
    const comment = ref("");
    const statusMessage = ref(null);
    const statusMessageClass = ref("");
    const carouselUI = {
      item: "basis-full",
      container: "rounded-lg",
      indicators: {
        wrapper: "relative bottom-0 mt-4"
      }
    };
    function updateRating(value) {
      rating.value = value;
    }
    function handleIndicatorClick(page, onClick) {
      pageRef.value = page;
      onClick(page);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCarousel = __nuxt_component_0;
      const _component_UButton = __nuxt_component_1;
      const _component_NuxtRating = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto p-6 bg-background text-text h-[40rem] flex items-center justify-center" }, _attrs))}><div class="w-full max-w-5xl p-6 rounded-lg flex flex-col md:grid md:grid-cols-2 md:gap-x-36 place-items-center"><div class="w-full md:w-auto flex justify-center mb-6 md:mb-0">`);
      _push(ssrRenderComponent(_component_UCarousel, {
        items: _ctx.imagePaths,
        ui: carouselUI,
        indicators: "",
        class: "w-full md:w-[30rem] mx-auto"
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
              onClick: ($event) => handleIndicatorClick(page, onClick)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                label: String(page),
                variant: active ? "solid" : "outline",
                size: "2xs",
                class: "rounded-full min-w-6 justify-center",
                onClick: ($event) => handleIndicatorClick(page, onClick)
              }, null, 8, ["label", "variant", "onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex flex-col space-y-6 w-full md:pl-8"><div class="text-center"><h1 class="text-2xl md:text-3xl font-bold mb-4"> Username: <span class="text-accent">${ssrInterpolate(_ctx.randomUser)}</span><h2 class="text-md md:text-lg font-semibold mt-2">Rating image number: ${ssrInterpolate(pageRef.value)}</h2></h1></div><div class="flex flex-col items-center mb-6">`);
      _push(ssrRenderComponent(_component_NuxtRating, {
        "read-only": false,
        "rating-size": 24,
        "rating-value": rating.value,
        "border-color": "#db8403",
        "active-color": "#ffa41c",
        "inactive-color": "#111827",
        "rating-step": 0.5,
        "rating-level": 10,
        "rating-count": 10,
        "rounded-corners": true,
        "border-width": 5,
        onRatingSelected: updateRating,
        class: "bg-background"
      }, null, _parent));
      _push(`</div><div class="w-full mb-6"><h2 class="text-lg md:text-xl font-semibold mb-2 text-center">Leave a comment:</h2><textarea rows="4" class="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Write your comment here...">${ssrInterpolate(comment.value)}</textarea></div><div class="mt-4 flex flex-col items-center w-full"><button class="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark"> Submit </button>`);
      if (statusMessage.value) {
        _push(`<p class="${ssrRenderClass([statusMessageClass.value, "mt-5"])}">${ssrInterpolate(statusMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Feed.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const users = ref([]);
    const allUsersFetched = ref(false);
    const noUsersAvailable = ref(false);
    const fetchedUserIds = ref(/* @__PURE__ */ new Set());
    async function fetchRandomUsers() {
      const queryParam = Array.from(fetchedUserIds.value).join(",");
      const response = await $fetch("/api/random", {
        method: "GET",
        query: { fetchedUserIds: queryParam }
      });
      if (response == null ? void 0 : response.data.randomUsers) {
        if (response.data.randomUsers.length === 0) {
          allUsersFetched.value = true;
        } else {
          noUsersAvailable.value = false;
          response.data.randomUsers.forEach((user) => {
            var _a2, _b, _c;
            var _a;
            if (user.userId && !fetchedUserIds.value.has(user.userId)) {
              fetchedUserIds.value.add(user.userId);
              users.value.push({
                imageIds: (_a2 = user.imageIds) != null ? _a2 : [],
                username: (_b = user.username) != null ? _b : "",
                userId: user.userId,
                imagePath: (_c = (_a = user.imageIds) == null ? void 0 : _a.map((id) => `/user-photos/${user.userId}/id_${id}.webp`)) != null ? _c : []
              });
            }
          });
        }
      } else {
        noUsersAvailable.value = true;
      }
    }
    useThrottleFn(async (event) => {
      if (allUsersFetched.value)
        return;
      const target = event.target;
      if (target.scrollHeight - target.scrollTop <= target.clientHeight + 5) {
        await fetchRandomUsers();
      }
    }, 300);
    [__temp, __restore] = withAsyncContext(() => fetchRandomUsers()), await __temp, __restore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Feed = _sfc_main$1;
      if (noUsersAvailable.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-center items-center h-screen" }, _attrs))}><p class="text-center text-5xl text-white">There are currently no photos to be rated.</p></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen overflow-auto flex flex-col" }, _attrs))}><div class="flex-1"><!--[-->`);
        ssrRenderList(users.value, (user) => {
          _push(ssrRenderComponent(_component_Feed, {
            key: user.userId,
            "image-paths": user.imagePath,
            "image-ids": user.imageIds,
            "random-user": user.username
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
        if (allUsersFetched.value) {
          _push(`<div class="text-center text-xl font-bold mb-10 mt-4 text-white"> All users have been fetched. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/feed/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CiXiSV-Z.mjs.map
