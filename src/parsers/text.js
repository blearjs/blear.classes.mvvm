/**
 * 文本解析
 * @author ydr.me
 * @created 2016-12-23 23:51
 */


'use strict';

var string = require('blear.utils.string');
var array = require('blear.utils.array');
var modification = require('blear.core.modification');

var parseExpression = require('./expression.js');
var configs = require('../configs');

var tagRE;
var DELIMITERS = [configs.textOpenTag, configs.textCloseTag];
var escapeRegExp = string.escapeRegExp;


/**
 * 构造成正则表达式
 * @type {exports.compileRegex}
 * @type {function}
 */
var compileRegex = function compileRegex() {
    var open = escapeRegExp(DELIMITERS[0]);
    var close = escapeRegExp(DELIMITERS[1]);

    tagRE = new RegExp(
        open + '(.+?)' + close,
        'g'
    );
};


/**
 * Parse a template text string into an array of tokens.
 *
 * @param {String} text
 * @return {Array<Object> | null}
 *               - {String} type
 *               - {String} value
 */

function parseTextToTokens(text) {
    if (!tagRE) {
        compileRegex();
    }

    var tokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match;
    var index;
    var value;
    var foundTag = false;

    while (match = tagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
            tokens.push({
                tag: false,
                value: text.slice(lastIndex, index)
            })
        }

        value = match[1];

        tokens.push({
            tag: true,
            value: value.trim()
        });
        foundTag = true;

        lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
        tokens.push({
            value: text.slice(lastIndex),
            tag: false
        })
    }

    if (!foundTag) {
        return null;
    }

    return tokens
}


/**
 * 解析文本为表达式执行函数
 * @param text
 * @returns {Function|null}
 */
module.exports = function parseTextToGetter(text) {
    var tokens = parseTextToTokens(text);

    if (tokens === null) {
        return null;
    }

    var expressionList = [];

    array.each(tokens, function (index, token) {
        var expression = '';

        if (token.tag) {
            expression += '(' + token.value + ')';
        } else {
            expression += '"' + string.textify(token.value) + '"';
        }

        expressionList.push(expression);
    });

    return parseExpression(expressionList.join(' + '));
};

