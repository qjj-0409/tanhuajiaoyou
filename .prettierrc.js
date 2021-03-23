module.exports = {
  bracketSpacing: true, // 对象中的空格，默认ture
  /**
   * JSX闭合位置
   * false: <div className=""
   *             style={{}}
   *        >
   * true: <div
   *          className=""
   *          style={{}} >
   */
  jsxBracketSameLine: false,
  singleQuote: true, // 使用单引号，默认false（在jsx中配置无效，默认都是双引号）
  trailingComma: 'none', // 行尾逗号，默认none，可选 none/es5/all
  arrowParens: 'avoid', // 箭头函数参数括号，默认avoid 可选 avoid/always
  "semi": false, // 使用分号, 默认true
};
