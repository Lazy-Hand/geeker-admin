<template>
  <el-dialog
    v-for="(item, index) in dialogList"
    :key="index"
    :title="item.title"
    :width="item.width"
    :draggable="item.draggable"
    v-model="item.visible"
    @close="() => closeDialog(item, index, '', true)"
  >
    <component :is="item.component" v-bind="item.props" @close="(...args:any) => closeDialog(item, index, args)" />
  </el-dialog>
</template>

<script setup lang="ts" name="OpenDialog">
import { dialogList, closeDialog } from "./index";
</script>
