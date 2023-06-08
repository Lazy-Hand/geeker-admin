<template>
  <svg :style="iconStyle" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed, CSSProperties } from "vue";

interface SvgProps {
  /**
   * @name name
   * @description 图标的名称 ==> 必传
   * @type {string}
   */
  name: string;

  /**
   * @name prefix
   * @description 图标的前缀 ==> 非必传（默认为"icon"）
   * @type {string}
   * @default icon
   */
  prefix?: string;

  /**
   * @name iconStyle
   * @description 图标的样式 ==> 非必传
   * @type {CSSProperties}
   */
  iconStyle?: CSSProperties;
}

const props = withDefaults(defineProps<SvgProps>(), {
  prefix: "icon",
  iconStyle: () => ({ width: "100px", height: "100px" })
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
