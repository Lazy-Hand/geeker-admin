<template>
  <el-dialog
    el-dialog
    v-model="dialogVisible"
    :title="`${dialogProps.title}新闻`"
    width="80%"
    draggable
    destroy-on-close
    align-center
  >
    <el-form ref="ruleFormRef" :model="dialogProps.rowData" overflow-auto h-180>
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属栏目">
            <el-select v-model="dialogProps.rowData.columnId">
              <el-option
                v-for="item in dialogProps.articleColumn"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="排序">
            <el-input-number v-model="dialogProps.rowData.sequence" :min="1" :max="10" controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="新闻标签">
            <el-select
              multiple
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              v-model="dialogProps.rowData.tags"
            ></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型">
            <el-radio-group v-model="dialogProps.rowData.type">
              <el-radio :label="0">原创</el-radio>
              <el-radio :label="1">转载</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="置顶">
            <el-radio-group v-model="dialogProps.rowData.top">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布">
            <el-radio-group v-model="dialogProps.rowData.status">
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">直接发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="转载来源">
            <el-input v-model="dialogProps.rowData.reprintSource"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="新闻标题">
        <el-input v-model="dialogProps.rowData.title" :rows="2" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="新闻封面">
        <UploadImg v-model:imageUrl="dialogProps.rowData.coverImage" width="250px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传 封面 图</span>
          </template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="内容">
        <WangEditor height="400px" v-model:value="dialogProps.rowData.content" customize-img customize-video />
        <el-button type="primary" @click="htmlVisible = true" mt-1>预览</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="htmlVisible" title="富文本内容预览" width="1300px" top="50px">
    <div class="view" v-html="dialogProps.rowData.content"></div>
  </el-dialog>
</template>

<script setup lang="ts" name="AddArticle">
import { ref } from "vue";
import WangEditor from "@/components/WangEditor/index.vue";
import UploadImg from "@/components/Upload/Img.vue";
import { ElMessage, FormInstance } from "element-plus";
const dialogVisible = ref(false);
const htmlVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
interface DialogProps {
  title: string;
  rowData?: any;
  isView: boolean;
  api?: (params: any) => Promise<any>;
  getTableList?: () => Promise<any>;
  tableData: Menu.MenuOptions[];
  articleColumn: { label: string; value: number }[];
}
const dialogProps = ref<DialogProps>({
  isView: false,
  title: "新增",
  tableData: [],
  articleColumn: []
});
// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  dialogProps.value = params;
  dialogVisible.value = true;
};

// 提交
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (!valid) return console.log("submit!");
    const newForm: Record<any, any> = {
      ...dialogProps.value.rowData,
      tags: dialogProps.value.rowData.tags.join(","),
      coverImage: dialogProps.value.rowData.coverImage.httpUrl
    };
    try {
      await dialogProps.value.api!({
        ...newForm
      });
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      await dialogProps.value.getTableList!();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
// 暴露方法
defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped></style>
