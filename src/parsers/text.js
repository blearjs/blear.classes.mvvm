/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-23 23:51
 */


'use strict';

// var string = require('blear.utils.string');
// var array = require('blear.utils.array');
//
// var expression = require('./expression.js');
//
// var tagRE, htmlRE;
// var DELIMITERS = ['{{', '}}'];
// var UNSAFE_DELIMITERS = ['{{{', '}}}'];
// var escapeRegExp = string.escapeRegExp;
//
//
// /**
//  * 构造成正则表达式
//  * @type {exports.compileRegex}
//  * @type {function}
//  */
// var compileRegex = exports.compileRegex = function compileRegex() {
//     var open = escapeRegExp(DELIMITERS[0]);
//     var close = escapeRegExp(DELIMITERS[1]);
//     var unsafeOpen = escapeRegExp(UNSAFE_DELIMITERS[0]);
//     var unsafeClose = escapeRegExp(UNSAFE_DELIMITERS[1]);
//     tagRE = new RegExp(
//         unsafeOpen + '(.+?)' + unsafeClose + '|' +
//         open + '(.+?)' + close,
//         'g'
//     );
//     htmlRE = new RegExp(
//         '^' + unsafeOpen + '.*' + unsafeClose + '$'
//     );
// };
//
//
// /**
//  * Parse a template text string into an array of tokens.
//  *
//  * @param {String} text
//  * @return {Array<Object> | null}
//  *               - {String} type
//  *               - {String} value
//  *               - {Boolean} [html]
//  *               - {Boolean} [oneTime]
//  */
//
// exports.parseText = function parseText(text) {
//     if (!tagRE) {
//         compileRegex();
//     }
//
//     text = text.replace(/\n/g, '');
//     if (!tagRE.test(text)) {
//         return null;
//     }
//     var tokens = [];
//     var lastIndex = tagRE.lastIndex = 0;
//     var match, index, html, value, first, oneTime;
//     while ((match = tagRE.exec(text))) {
//         index = match.index;
//         // push text token
//         if (index > lastIndex) {
//             tokens.push({
//                 value: text.slice(lastIndex, index)
//             });
//         }
//         // tag token
//         html = htmlRE.test(match[0]);
//         value = html ? match[1] : match[2];
//         first = value.charCodeAt(0);
//         oneTime = first === 42; // *
//         value = oneTime ? value.slice(1) : value;
//         tokens.push({
//             tag: true,
//             value: value.trim(),
//             html: html,
//             oneTime: oneTime
//         });
//         lastIndex = index + match[0].length;
//     }
//     if (lastIndex < text.length) {
//         tokens.push({
//             value: text.slice(lastIndex)
//         });
//     }
//     return tokens;
// };
//
//
// /**
//  * Format a list of tokens into an expression.
//  * e.g. tokens parsed from 'a {{b}} c' can be serialized
//  * into one single expression as '"a " + b + " c"'.
//  *
//  * @param {Array} tokens
//  * @param {Vue} [vm]
//  * @return {String}
//  */
//
// exports.tokensToExp = function tokensToExp(tokens, vm) {
//     if (tokens.length > 1) {
//         var ret = [];
//         array.each(tokens, function (index, token) {
//             ret.push(formatToken(token, vm));
//         });
//         return ret.join('+');
//     } else {
//         return formatToken(tokens[0], vm, true);
//     }
// };
//
// /**
//  * Format a single token.
//  *
//  * @param {Object} token
//  * @param {Vue} [vm]
//  * @param {Boolean} [single]
//  * @return {String}
//  */
//
// function formatToken(token, vm, single) {
//     if (token.tag) {
//         if (token.oneTime && vm) {
//             return '"' + vm.$eval(token.value) + '"';
//         } else {
//             return inlineFilters(token.value, single);
//         }
//     } else {
//         return '"' + token.value + '"';
//     }
// }
//
// /**
//  * For an attribute with multiple interpolation tags,
//  * e.g. attr="some-{{thing | filter}}", in order to combine
//  * the whole thing into a single watchable expression, we
//  * have to inline those filters. This function does exactly
//  * that. This is a bit hacky but it avoids heavy changes
//  * to directive parser and watcher mechanism.
//  *
//  * @param {String} exp
//  * @param {Boolean} single
//  * @return {String}
//  */
//
// var filterRE = /[^|]\|[^|]/;
//
// function inlineFilters(exp, single) {
//     if (!filterRE.test(exp)) {
//         return single ? exp : '(' + exp + ')';
//     } else {
//         var dir = expression.parse(exp);
//         if (!dir.filters) {
//             return '(' + exp + ')';
//         } else {
//             return 'this._applyFilters(' +
//                 dir.expression + // value
//                 ',null,' +       // oldValue (null for read)
//                 JSON.stringify(dir.filters) + // filter descriptors
//                 ',false)';        // write?
//         }
//     }
// }


var Lexer = require('blear.shims.lexer');

var lexer = new Lexer();

module.exports = function (text) {
    var tokens = lexer.lex(text);
};
