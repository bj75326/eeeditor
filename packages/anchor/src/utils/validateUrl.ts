const urlMatchRegExp: RegExp = /^(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;

export const validateUrl = (url: string): boolean => urlMatchRegExp.test(url);

export default validateUrl;
