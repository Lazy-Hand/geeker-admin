<template>
  <div>
    <el-card>
      <template #header>
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="商品信息" />
          <el-step title="商品详情" />
          <el-step title="其他设置" />
        </el-steps>
      </template>
      <el-form label-position="right" label-width="120">
        <el-row :gutter="80">
          <el-col :span="12">
            <el-form-item label="商品名称：">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品分类：">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品关键字：">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位：">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品简介：">
              <el-input type="textarea" :rows="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品封面图：">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品轮播图：">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主图视频：">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="运费模板：">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品规格：">
              <el-radio-group class="ml-4">
                <el-radio label="1" size="large">Option 1</el-radio>
                <el-radio label="2" size="large">Option 2</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="佣金设置：">
              <el-input></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const active = ref(0);
</script>

<style lang="scss" scoped></style>
