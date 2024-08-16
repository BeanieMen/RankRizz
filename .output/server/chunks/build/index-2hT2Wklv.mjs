import { useSSRContext, defineComponent, ref, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCookie } from './client-only-UjP8Ct3o.mjs';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SignUp",
  __ssrInlineRender: true,
  setup(__props) {
    const username = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");
    const successLink = ref("");
    useCookie("passKey");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto mt-8 p-6 bg-white rounded-lg" }, _attrs))}><form><div class="mb-4"><label for="username" class="block text-gray-700 font-bold mb-2">Username:</label><input id="username"${ssrRenderAttr("value", username.value)} type="text" required class="w-full text-black px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div class="flex justify-center"><button type="submit" class="px-5 bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-300"> Generate Account </button></div>`);
      if (errorMessage.value) {
        _push(`<p class="mt-4 text-red-500 font-bold">${ssrInterpolate(errorMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (successMessage.value) {
        _push(`<p class="mt-4 text-green-500 font-bold"><a${ssrRenderAttr("href", successLink.value)} class="text-green-500 hover:underline">${ssrInterpolate(successMessage.value)}</a></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SignUp.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_SignUp = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-[#313756] flex flex-col justify-center items-center mx-5 h-screen" }, _attrs))}><div class="w-full max-w-lg p-6 shadow-md rounded-lg bg-white"><h1 class="text-2xl font-bold mb-6 text-center">Welcome to RankRizz</h1><p class="text-center mb-6"> Ever wondered what\u2019s the real tea on your pics? <br> \u{1F31F} RankRizz is where you drop your photos and get the lowdown from real people. No filters, just straight-up honest reviews and opinions. </p><div class="shadow-2xl p-6"><div class="w-full font-bold py-2 px-4 rounded-lg bg-blue-500 text-white transition duration-300 text-center"> Sign Up </div><div class="mt-4">`);
  _push(ssrRenderComponent(_component_SignUp, null, null, _parent));
  _push(`</div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-2hT2Wklv.mjs.map
