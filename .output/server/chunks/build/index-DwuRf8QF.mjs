import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto py-12 px-8 md:px-10" }, _attrs))}><h1 class="mb-8 md:mb-10 font-bold text-4xl md:text-5xl text-accent text-center"> FAQ </h1><h2 class="font-bold text-3xl md:text-4xl text-text mb-4 md:mb-6"> General Questions </h2><div class="mt-5 p-6 md:p-8 lg:p-10 bg-background rounded-lg shadow-lg border-4 border-secondary transition-transform transform hover:scale-105"><h3 class="mb-6 md:mb-8 font-bold text-2xl md:text-3xl text-text"> What is RankRizz? </h3><p class="text-lg text-text leading-relaxed"> RankRizz is a social experiment that shows how different people vibe with beauty. It\u2019s all about uncovering what makes someone or something look \u{1F525} to different folks and how culture and personal tastes shape those views. </p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/faq/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-DwuRf8QF.mjs.map
