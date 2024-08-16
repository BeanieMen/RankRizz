import { m as mergeConfig, d as appConfig, e as __nuxt_component_1$2, f as __nuxt_component_0$3, n as nuxtLinkProps, g as useUI, h as useInjectButtonGroup, i as getNuxtLinkProps, _ as _export_sfc } from './server.mjs';
import { defineComponent, toRef, computed, useSSRContext, ref, mergeProps, withCtx, renderSlot, openBlock, createBlock, createCommentVNode, toDisplayString, watch } from 'vue';
import { twMerge, twJoin } from 'tailwind-merge';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { useScroll, useElementSize, useResizeObserver } from '@vueuse/core';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const button = {
  base: "focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0",
  font: "font-medium",
  rounded: "rounded-md",
  truncate: "text-left break-all line-clamp-1",
  block: "w-full flex justify-center items-center",
  inline: "inline-flex items-center",
  size: {
    "2xs": "text-xs",
    xs: "text-xs",
    sm: "text-sm",
    md: "text-sm",
    lg: "text-sm",
    xl: "text-base"
  },
  gap: {
    "2xs": "gap-x-1",
    xs: "gap-x-1.5",
    sm: "gap-x-1.5",
    md: "gap-x-2",
    lg: "gap-x-2.5",
    xl: "gap-x-2.5"
  },
  padding: {
    "2xs": "px-2 py-1",
    xs: "px-2.5 py-1.5",
    sm: "px-2.5 py-1.5",
    md: "px-3 py-2",
    lg: "px-3.5 py-2.5",
    xl: "px-3.5 py-2.5"
  },
  square: {
    "2xs": "p-1",
    xs: "p-1.5",
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
    xl: "p-2.5"
  },
  color: {
    white: {
      solid: "shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      ghost: "text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400"
    },
    gray: {
      solid: "shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      ghost: "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      link: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400"
    },
    black: {
      solid: "shadow-sm text-white dark:text-gray-900 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 dark:disabled:bg-white focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      link: "text-gray-900 dark:text-white underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400"
    }
  },
  variant: {
    solid: "shadow-sm text-white dark:text-gray-900 bg-{color}-500 hover:bg-{color}-600 disabled:bg-{color}-500 dark:bg-{color}-400 dark:hover:bg-{color}-500 dark:disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400",
    outline: "ring-1 ring-inset ring-current text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
    soft: "text-{color}-500 dark:text-{color}-400 bg-{color}-50 hover:bg-{color}-100 disabled:bg-{color}-50 dark:bg-{color}-950 dark:hover:bg-{color}-900 dark:disabled:bg-{color}-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
    ghost: "text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
    link: "text-{color}-500 hover:text-{color}-600 disabled:text-{color}-500 dark:text-{color}-400 dark:hover:text-{color}-500 dark:disabled:text-{color}-400 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400"
  },
  icon: {
    base: "flex-shrink-0",
    loading: "animate-spin",
    size: {
      "2xs": "h-4 w-4",
      xs: "h-4 w-4",
      sm: "h-5 w-5",
      md: "h-5 w-5",
      lg: "h-5 w-5",
      xl: "h-6 w-6"
    }
  },
  default: {
    size: "sm",
    variant: "solid",
    color: "primary",
    loadingIcon: "i-heroicons-arrow-path-20-solid"
  }
};
const carousel = {
  wrapper: "relative",
  container: "relative w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth",
  item: "flex flex-none snap-center",
  arrows: {
    wrapper: "flex items-center justify-between"
  },
  indicators: {
    wrapper: "absolute flex items-center justify-center gap-3 bottom-4 inset-x-0",
    base: "rounded-full h-3 w-3",
    active: "bg-primary-500 dark:bg-primary-400",
    inactive: "bg-gray-100 dark:bg-gray-800"
  },
  default: {
    prevButton: {
      color: "black",
      class: "rtl:[&_span:first-child]:rotate-180 absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full",
      icon: "i-heroicons-chevron-left-20-solid"
    },
    nextButton: {
      color: "black",
      class: "rtl:[&_span:last-child]:rotate-180 absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full",
      icon: "i-heroicons-chevron-right-20-solid "
    }
  }
};
const config$1 = mergeConfig(appConfig.ui.strategy, appConfig.ui.button, button);
const _sfc_main$3 = defineComponent({
  components: {
    UIcon: __nuxt_component_1$2,
    ULink: __nuxt_component_0$3
  },
  inheritAttrs: false,
  props: {
    ...nuxtLinkProps,
    type: {
      type: String,
      default: "button"
    },
    block: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: () => config$1.default.size,
      validator(value) {
        return Object.keys(config$1.size).includes(value);
      }
    },
    color: {
      type: String,
      default: () => config$1.default.color,
      validator(value) {
        return [...appConfig.ui.colors, ...Object.keys(config$1.color)].includes(value);
      }
    },
    variant: {
      type: String,
      default: () => config$1.default.variant,
      validator(value) {
        return [
          ...Object.keys(config$1.variant),
          ...Object.values(config$1.color).flatMap((value2) => Object.keys(value2))
        ].includes(value);
      }
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => config$1.default.loadingIcon
    },
    leadingIcon: {
      type: String,
      default: null
    },
    trailingIcon: {
      type: String,
      default: null
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    square: {
      type: Boolean,
      default: false
    },
    truncate: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    const { ui, attrs } = useUI("button", toRef(props, "ui"), config$1);
    const { size, rounded } = useInjectButtonGroup({ ui, props });
    const isLeading = computed(() => {
      return props.icon && props.leading || props.icon && !props.trailing || props.loading && !props.trailing || props.leadingIcon;
    });
    const isTrailing = computed(() => {
      return props.icon && props.trailing || props.loading && props.trailing || props.trailingIcon;
    });
    const isSquare = computed(() => props.square || !slots.default && !props.label);
    const buttonClass = computed(() => {
      var _a, _b;
      const variant = ((_b = (_a = ui.value.color) == null ? void 0 : _a[props.color]) == null ? void 0 : _b[props.variant]) || ui.value.variant[props.variant];
      return twMerge(twJoin(
        ui.value.base,
        ui.value.font,
        rounded.value,
        ui.value.size[size.value],
        ui.value.gap[size.value],
        props.padded && ui.value[isSquare.value ? "square" : "padding"][size.value],
        variant == null ? void 0 : variant.replaceAll("{color}", props.color),
        props.block ? ui.value.block : ui.value.inline
      ), props.class);
    });
    const leadingIconName = computed(() => {
      if (props.loading) {
        return props.loadingIcon;
      }
      return props.leadingIcon || props.icon;
    });
    const trailingIconName = computed(() => {
      if (props.loading && !isLeading.value) {
        return props.loadingIcon;
      }
      return props.trailingIcon || props.icon;
    });
    const leadingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.size[size.value],
        props.loading && ui.value.icon.loading
      );
    });
    const trailingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.size[size.value],
        props.loading && !isLeading.value && ui.value.icon.loading
      );
    });
    const linkProps = computed(() => getNuxtLinkProps(props));
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isLeading,
      isTrailing,
      isSquare,
      buttonClass,
      leadingIconName,
      trailingIconName,
      leadingIconClass,
      trailingIconClass,
      linkProps
    };
  }
});
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ULink = __nuxt_component_0$3;
  const _component_UIcon = __nuxt_component_1$2;
  _push(ssrRenderComponent(_component_ULink, mergeProps({
    type: _ctx.type,
    disabled: _ctx.disabled || _ctx.loading,
    class: _ctx.buttonClass
  }, { ..._ctx.linkProps, ..._ctx.attrs }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "leading", {
          disabled: _ctx.disabled,
          loading: _ctx.loading
        }, () => {
          if (_ctx.isLeading && _ctx.leadingIconName) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: _ctx.leadingIconName,
              class: _ctx.leadingIconClass,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            _push2(`<!---->`);
          }
        }, _push2, _parent2, _scopeId);
        ssrRenderSlot(_ctx.$slots, "default", {}, () => {
          if (_ctx.label) {
            _push2(`<span class="${ssrRenderClass([_ctx.truncate ? _ctx.ui.truncate : ""])}"${_scopeId}>${ssrInterpolate(_ctx.label)}</span>`);
          } else {
            _push2(`<!---->`);
          }
        }, _push2, _parent2, _scopeId);
        ssrRenderSlot(_ctx.$slots, "trailing", {
          disabled: _ctx.disabled,
          loading: _ctx.loading
        }, () => {
          if (_ctx.isTrailing && _ctx.trailingIconName) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: _ctx.trailingIconName,
              class: _ctx.trailingIconClass,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            _push2(`<!---->`);
          }
        }, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot(_ctx.$slots, "leading", {
            disabled: _ctx.disabled,
            loading: _ctx.loading
          }, () => [
            _ctx.isLeading && _ctx.leadingIconName ? (openBlock(), createBlock(_component_UIcon, {
              key: 0,
              name: _ctx.leadingIconName,
              class: _ctx.leadingIconClass,
              "aria-hidden": "true"
            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
          ]),
          renderSlot(_ctx.$slots, "default", {}, () => [
            _ctx.label ? (openBlock(), createBlock("span", {
              key: 0,
              class: [_ctx.truncate ? _ctx.ui.truncate : ""]
            }, toDisplayString(_ctx.label), 3)) : createCommentVNode("", true)
          ]),
          renderSlot(_ctx.$slots, "trailing", {
            disabled: _ctx.disabled,
            loading: _ctx.loading
          }, () => [
            _ctx.isTrailing && _ctx.trailingIconName ? (openBlock(), createBlock(_component_UIcon, {
              key: 0,
              name: _ctx.trailingIconName,
              class: _ctx.trailingIconClass,
              "aria-hidden": "true"
            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
          ])
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@2.18.4_focus-trap@7.5.4_magicast@0.3.4_rollup@4.18.0_vite@5.3.1_@types+node@20.14.3__azjs23jvwpkkmt6hljdqtktb5m/node_modules/@nuxt/ui/dist/runtime/components/elements/Button.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1]]);
const useCarouselScroll = (el) => {
  ref(0);
};
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.carousel, carousel);
const _sfc_main$2 = defineComponent({
  components: {
    UButton: __nuxt_component_1
  },
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      default: () => []
    },
    arrows: {
      type: Boolean,
      default: false
    },
    indicators: {
      type: Boolean,
      default: false
    },
    prevButton: {
      type: Object,
      default: () => config.default.prevButton
    },
    nextButton: {
      type: Object,
      default: () => config.default.nextButton
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: void 0
    }
  },
  setup(props, { expose }) {
    const { ui, attrs } = useUI("carousel", toRef(props, "ui"), config, toRef(props, "class"));
    const carouselRef = ref();
    const itemWidth = ref(0);
    const { x } = useScroll(carouselRef, { behavior: "smooth" });
    const { width: carouselWidth } = useElementSize(carouselRef);
    useCarouselScroll();
    useResizeObserver(carouselRef, (entries) => {
      var _a, _b;
      const [entry] = entries;
      itemWidth.value = ((_b = (_a = entry == null ? void 0 : entry.target) == null ? void 0 : _a.firstElementChild) == null ? void 0 : _b.clientWidth) || 0;
    });
    const currentPage = computed(() => {
      if (!itemWidth.value) {
        return 0;
      }
      return Math.round(x.value / itemWidth.value) + 1;
    });
    const pages = computed(() => {
      if (!itemWidth.value) {
        return 0;
      }
      return props.items.length - Math.round(carouselWidth.value / itemWidth.value) + 1;
    });
    const isFirst = computed(() => currentPage.value <= 1);
    const isLast = computed(() => currentPage.value === pages.value);
    function onClickNext() {
      x.value += itemWidth.value;
    }
    function onClickPrev() {
      x.value -= itemWidth.value;
    }
    function onClick(page) {
      x.value = (page - 1) * itemWidth.value;
    }
    expose({
      pages,
      page: currentPage,
      prev: onClickPrev,
      next: onClickNext,
      select: onClick
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isFirst,
      isLast,
      carouselRef,
      pages,
      currentPage,
      onClickNext,
      onClickPrev,
      onClick,
      twMerge
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_UButton = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.ui.wrapper
  }, _ctx.attrs, _attrs))} data-v-1f6feb15><div class="${ssrRenderClass([_ctx.ui.container, "no-scrollbar"])}" data-v-1f6feb15><!--[-->`);
  ssrRenderList(_ctx.items, (item, index) => {
    _push(`<div class="${ssrRenderClass(_ctx.ui.item)}"${ssrRenderAttr("role", _ctx.indicators ? "tabpanel" : null)} data-v-1f6feb15>`);
    ssrRenderSlot(_ctx.$slots, "default", {
      item,
      index
    }, null, _push, _parent);
    _push(`</div>`);
  });
  _push(`<!--]--></div>`);
  if (_ctx.arrows) {
    _push(`<div class="${ssrRenderClass(_ctx.ui.arrows.wrapper)}" data-v-1f6feb15>`);
    ssrRenderSlot(_ctx.$slots, "prev", {
      onClick: _ctx.onClickPrev,
      disabled: _ctx.isFirst
    }, () => {
      var _a;
      if (_ctx.prevButton) {
        _push(ssrRenderComponent(_component_UButton, mergeProps({ disabled: _ctx.isFirst }, { ..._ctx.ui.default.prevButton, ..._ctx.prevButton }, {
          class: _ctx.twMerge(_ctx.ui.default.prevButton.class, (_a = _ctx.prevButton) == null ? void 0 : _a.class),
          "aria-label": "Prev",
          onClick: _ctx.onClickPrev
        }), null, _parent));
      } else {
        _push(`<!---->`);
      }
    }, _push, _parent);
    ssrRenderSlot(_ctx.$slots, "next", {
      onClick: _ctx.onClickNext,
      disabled: _ctx.isLast
    }, () => {
      var _a;
      if (_ctx.nextButton) {
        _push(ssrRenderComponent(_component_UButton, mergeProps({ disabled: _ctx.isLast }, { ..._ctx.ui.default.nextButton, ..._ctx.nextButton }, {
          class: _ctx.twMerge(_ctx.ui.default.nextButton.class, (_a = _ctx.nextButton) == null ? void 0 : _a.class),
          "aria-label": "Next",
          onClick: _ctx.onClickNext
        }), null, _parent));
      } else {
        _push(`<!---->`);
      }
    }, _push, _parent);
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.indicators) {
    _push(`<div role="tablist" class="${ssrRenderClass(_ctx.ui.indicators.wrapper)}" data-v-1f6feb15><!--[-->`);
    ssrRenderList(_ctx.pages, (page) => {
      ssrRenderSlot(_ctx.$slots, "indicator", {
        onClick: _ctx.onClick,
        active: page === _ctx.currentPage,
        page
      }, () => {
        _push(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", page === _ctx.currentPage)} class="${ssrRenderClass([
          _ctx.ui.indicators.base,
          page === _ctx.currentPage ? _ctx.ui.indicators.active : _ctx.ui.indicators.inactive
        ])}"${ssrRenderAttr("aria-label", `set slide ${page}`)} data-v-1f6feb15></button>`);
      }, _push, _parent);
    });
    _push(`<!--]--></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@2.18.4_focus-trap@7.5.4_magicast@0.3.4_rollup@4.18.0_vite@5.3.1_@types+node@20.14.3__azjs23jvwpkkmt6hljdqtktb5m/node_modules/@nuxt/ui/dist/runtime/components/elements/Carousel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-1f6feb15"]]);
class AlphaColor {
  constructor(color) {
    __publicField(this, "color");
    __publicField(this, "opacity");
    this.color = color;
    this.opacity = 1;
  }
  parseAlphaColor() {
    const match = this.color.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const [r, g, b, a] = match[1].split(",").map(Number);
      this.color = `rgb(${r}, ${g}, ${b})`;
      this.opacity = a !== void 0 ? a : 1;
    }
    return this;
  }
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NuxtStar",
  __ssrInlineRender: true,
  props: {
    fill: {},
    points: {},
    size: {},
    starId: {},
    activeColor: {},
    inactiveColor: {},
    borderColor: {},
    skeletonColor: {},
    borderWidth: {},
    roundedCorners: { type: Boolean }
  },
  emits: ["star-mouse-move", "star-selected"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const getColor = (color) => new AlphaColor(color).parseAlphaColor().color;
    const getOpacity = (color) => new AlphaColor(color).parseAlphaColor().opacity;
    const grad = ref(props.activeColor);
    ref(true);
    const parseSize = (size2) => {
      if (typeof size2 === "number")
        return size2;
      const value = parseFloat(size2);
      return isNaN(value) ? 0 : value;
    };
    const size = parseSize(props.size);
    const starPointsToString = computed(() => props.points.join(","));
    const gradId = computed(() => `url(#${grad.value})`);
    const starSize = computed(() => {
      return size + (props.roundedCorners && props.borderWidth <= 0 ? 6 : props.borderWidth);
    });
    const starFill = computed(() => `${props.fill}%`);
    const getBorderColor = computed(
      () => props.roundedCorners && props.borderWidth <= 0 ? props.inactiveColor : props.borderColor
    );
    const maxSize = computed(() => {
      const max = Math.max(...props.points);
      return isFinite(max) ? max : 100;
    });
    const viewBox = computed(() => `0 0 ${maxSize.value} ${maxSize.value}`);
    const strokeLinejoin = computed(() => props.roundedCorners ? "round" : "miter");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-96d8296b><svg class="nuxt-rating-star-svg"${ssrRenderAttr("height", starSize.value)}${ssrRenderAttr("width", starSize.value)}${ssrRenderAttr("viewBox", viewBox.value)} data-v-96d8296b><linearGradient${ssrRenderAttr("id", grad.value)} x1="0" x2="100%" y1="0" y2="0" data-v-96d8296b><stop${ssrRenderAttr("offset", starFill.value)}${ssrRenderAttr("stop-color", getColor(_ctx.activeColor))}${ssrRenderAttr("stop-opacity", getOpacity(_ctx.activeColor))} data-v-96d8296b></stop><stop${ssrRenderAttr("offset", starFill.value)}${ssrRenderAttr("stop-color", getColor(_ctx.inactiveColor))}${ssrRenderAttr("stop-opacity", getOpacity(_ctx.inactiveColor))} data-v-96d8296b></stop></linearGradient><polygon${ssrRenderAttr("height", starSize.value)}${ssrRenderAttr("width", starSize.value)}${ssrRenderAttr("points", starPointsToString.value)}${ssrRenderAttr("fill", gradId.value)}${ssrRenderAttr("stroke", getBorderColor.value)}${ssrRenderAttr("stroke-width", _ctx.borderWidth)}${ssrRenderAttr("stroke-linejoin", strokeLinejoin.value)} data-v-96d8296b></polygon><polygon${ssrRenderAttr("points", starPointsToString.value)}${ssrRenderAttr("fill", gradId.value)} data-v-96d8296b></polygon></svg></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/nuxt-rating@0.1.5_magicast@0.3.4_rollup@4.18.0/node_modules/nuxt-rating/dist/runtime/components/NuxtStar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const NuxtStar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-96d8296b"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NuxtRating",
  __ssrInlineRender: true,
  props: {
    ratingStep: { default: 0.1 },
    ratingValue: { default: 4.5 },
    roundStartRating: { type: Boolean, default: true },
    activeColor: { default: "#ffa41c" },
    inactiveColor: { default: "#d8d8d8" },
    skeletonColor: { default: "#d8d8d8" },
    ratingCount: { default: 5 },
    ratingContent: { default: () => [19.8, 2.2, 6.6, 43.56, 39.6, 17.16, 0, 17.16, 33, 43.56] },
    ratingSize: { default: 15 },
    ratingSpacing: { default: 2 },
    readOnly: { type: Boolean, default: true },
    inline: { type: Boolean, default: false },
    borderColor: { default: "#db8403" },
    borderWidth: { default: 0 },
    roundedCorners: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false }
  },
  emits: ["ratingSelected", "ratingHovered"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const step = ref(props.ratingStep * 100);
    const currentRating = ref(props.ratingValue);
    const selectedRating = ref(props.ratingValue);
    const ratingSelected = ref(false);
    const isLoading = ref(true);
    const shouldRound = computed(() => ratingSelected.value || props.roundStartRating);
    const activeColors = computed(
      () => Array.isArray(props.activeColor) ? padColors(props.activeColor, props.ratingCount, props.activeColor.slice(-1)[0]) : new Array(props.ratingCount).fill(props.activeColor)
    );
    const currentActiveColor = computed(
      () => selectedRating.value > 0 ? activeColors.value[Math.ceil(selectedRating.value) - 1] : props.inactiveColor
    );
    const roundedRating = computed(() => {
      const inv = 1 / props.ratingStep;
      return Math.min(props.ratingCount, Math.ceil(currentRating.value * inv) / inv);
    });
    const fillLevel = computed(() => {
      const rating = shouldRound.value ? roundedRating.value : currentRating.value;
      return Array.from({ length: props.ratingCount }, (_, i) => {
        if (i < rating) {
          return rating - i > 1 ? 100 : (rating - i) * 100;
        }
        return 0;
      });
    });
    watch(
      () => props.ratingValue,
      (val) => {
        currentRating.value = val;
        selectedRating.value = val;
      }
    );
    const setRating = (event, persist) => {
      var _a;
      if (!props.readOnly) {
        const position = Number(event.position) / 100;
        const newRating = event.id - 1 + Math.ceil(position * (1 / props.ratingStep)) * props.ratingStep;
        currentRating.value = Math.min(newRating, props.ratingCount);
        const decimalPlaces = ((_a = props.ratingStep.toString().split(".")[1]) == null ? void 0 : _a.length) || 0;
        const formattedRating = Number(currentRating.value.toFixed(decimalPlaces));
        if (persist) {
          selectedRating.value = props.clearable && currentRating.value === selectedRating.value ? 0 : currentRating.value;
          ratingSelected.value = true;
          emit("ratingSelected", formattedRating);
        }
        emit("ratingHovered", formattedRating);
      }
    };
    const padColors = (array, minLength, fillValue) => array.concat(Array(minLength - array.length).fill(fillValue));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["nuxt-rating-wrapper", { "nuxt-rating-inline": props.inline }]
      }, _attrs))} data-v-52b39f7e><!--[-->`);
      ssrRenderList(props.ratingCount, (n) => {
        _push(`<span class="${ssrRenderClass([{ "nuxt-rating-pointer": !props.readOnly, "skeleton-pulse": isLoading.value }, "nuxt-rating-star"])}" style="${ssrRenderStyle({ marginRight: n !== props.ratingCount ? `${props.ratingSpacing}px` : "0" })}" data-v-52b39f7e>`);
        _push(ssrRenderComponent(NuxtStar, {
          fill: isLoading.value ? 100 : fillLevel.value[n - 1],
          size: props.ratingSize,
          points: props.ratingContent,
          "star-id": n,
          step: step.value,
          "active-color": isLoading.value ? props.skeletonColor : currentActiveColor.value,
          "inactive-color": props.inactiveColor,
          "border-color": isLoading.value ? props.skeletonColor : props.borderColor,
          "border-width": props.borderWidth,
          "rounded-corners": props.roundedCorners,
          onStarSelected: ($event) => setRating($event, true),
          onStarMouseMove: setRating
        }, null, _parent));
        _push(`</span>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/nuxt-rating@0.1.5_magicast@0.3.4_rollup@4.18.0/node_modules/nuxt-rating/dist/runtime/components/NuxtRating.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-52b39f7e"]]);

export { __nuxt_component_0 as _, __nuxt_component_1 as a, __nuxt_component_2 as b };
//# sourceMappingURL=NuxtRating-o8Okvodf.mjs.map
