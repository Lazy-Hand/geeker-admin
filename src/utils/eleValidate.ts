// ? Element 常用表单校验规则

/**
 *  @rule 手机号
 */
export function checkPhoneNumber(rule: any, value: any, callback: any) {
  const regexp = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
  if (value === "") callback("请输入手机号码");
  if (!regexp.test(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    return callback();
  }
}

// 短信模板rule
export const noteValidate = (rule: any, value: any, callback: any) => {
  const regexp = /^.+?(?=退订回T$)/;
  if (value === "") callback("请填写短信模板");
  if (!regexp.test(value)) {
    callback(new Error("请在模板结尾填写 退订回T， 可点击下方复制按钮复制文本"));
  } else {
    return callback();
  }
};
