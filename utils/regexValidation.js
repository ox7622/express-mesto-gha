/* eslint-disable arrow-parens */
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const linkRegex = /^https?:\/\/(wwww.)?[-._~:/?#@!$&'()*+,;=a-zA-Z0-9]+$/;
module.exports = { linkRegex };
function dataValidation(data, regex) {
  return regex.test(data);
}
module.exports.linkValidation = data => dataValidation(data, linkRegex);
module.exports.emailValidation = data => dataValidation(data, emailRegex);
