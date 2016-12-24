/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-23 16:31
 */


'use strict';

var typeis = require('blear.utils.typeis');

var varible = require('../utils/varible');

var SCOPE = varible();

// actions
var APPEND = 0;
var PUSH = 1;
var INC_SUB_PATH_DEPTH = 2;
var PUSH_SUB_PATH = 3;

// states
var BEFORE_PATH = 0;
var IN_PATH = 1;
var BEFORE_IDENT = 2;
var IN_IDENT = 3;
var IN_SUB_PATH = 4;
var IN_SINGLE_QUOTE = 5;
var IN_DOUBLE_QUOTE = 6;
var AFTER_PATH = 7;
var ERROR = 8;

var pathStateMachine = [];

pathStateMachine[BEFORE_PATH] = {
    'ws': [BEFORE_PATH],
    'ident': [IN_IDENT, APPEND],
    '[': [IN_SUB_PATH],
    'eof': [AFTER_PATH]
};

pathStateMachine[IN_PATH] = {
    'ws': [IN_PATH],
    '.': [BEFORE_IDENT],
    '[': [IN_SUB_PATH],
    'eof': [AFTER_PATH]
};

pathStateMachine[BEFORE_IDENT] = {
    'ws': [BEFORE_IDENT],
    'ident': [IN_IDENT, APPEND]
};

pathStateMachine[IN_IDENT] = {
    'ident': [IN_IDENT, APPEND],
    '0': [IN_IDENT, APPEND],
    'number': [IN_IDENT, APPEND],
    'ws': [IN_PATH, PUSH],
    '.': [BEFORE_IDENT, PUSH],
    '[': [IN_SUB_PATH, PUSH],
    'eof': [AFTER_PATH, PUSH]
};

pathStateMachine[IN_SUB_PATH] = {
    "'": [IN_SINGLE_QUOTE, APPEND],
    '"': [IN_DOUBLE_QUOTE, APPEND],
    '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
    ']': [IN_PATH, PUSH_SUB_PATH],
    'eof': ERROR,
    'else': [IN_SUB_PATH, APPEND]
};

pathStateMachine[IN_SINGLE_QUOTE] = {
    "'": [IN_SUB_PATH, APPEND],
    'eof': ERROR,
    'else': [IN_SINGLE_QUOTE, APPEND]
};

pathStateMachine[IN_DOUBLE_QUOTE] = {
    '"': [IN_SUB_PATH, APPEND],
    'eof': ERROR,
    'else': [IN_DOUBLE_QUOTE, APPEND]
};


var allowedKeywords =
    'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
    'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
    'encodeURIComponent,parseInt,parseFloat';
var allowedKeywordsRE =
    new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

// keywords that don't make sense inside expressions
var improperKeywords =
    'break,case,class,catch,const,continue,debugger,default,' +
    'delete,do,else,export,extends,finally,for,function,if,' +
    'import,in,instanceof,let,return,super,switch,throw,try,' +
    'var,while,with,yield,enum,await,implements,package,' +
    'protected,static,interface,private,public';
var improperKeywordsRE =
    new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');

var wsRE = /\s/g;
var newlineRE = /\n/g;
var saveRE = /[{,]\s*[\w$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
var restoreRE = /"(\d+)"/g;
var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;
var identRE = /[^\w$.](?:[A-Za-z_$][\w$]*)/g;
var booleanLiteralRE = /^(?:true|false)$/;


/**
 * Save / Rewrite / Restore
 *
 * When rewriting paths found in an expression, it is
 * possible for the same letter sequences to be found in
 * strings and Object literal property keys. Therefore we
 * remove and store these parts in a temporary array, and
 * restore them after the path rewrite.
 */

var saved = [];

/**
 * Save replacer
 *
 * The save regex can match two possible cases:
 * 1. An opening object literal
 * 2. A string
 * If matched as a plain string, we need to escape its
 * newlines, since the string needs to be preserved when
 * generating the function body.
 *
 * @param {String} str
 * @param {String} isString - str if matched as a string
 * @return {String} - placeholder with index
 */

var saveExp = function saveExp(str, isString) {
    var i = saved.length;

    saved[i] = isString ?
        str.replace(newlineRE, '\\n') :
        str;

    return '"' + i + '"';
};


/**
 * Path rewrite replacer
 *
 * @param {String} raw
 * @return {String}
 */
var rewriteExp = function rewriteExp(raw) {
    var c = raw.charAt(0);
    var path = raw.slice(1);
    if (allowedKeywordsRE.test(path)) {
        return raw;
    } else {
        path = path.indexOf('"') > -1 ?
            path.replace(restoreRE, restoreExp) :
            path;
        return c + SCOPE + '.' + path;
    }
};


/**
 * Restore replacer
 *
 * @param {String} str
 * @param {String} i - matched save index
 * @return {String}
 */
function restoreExp(str, i) {
    return saved[i];
}


/**
 * Build a getter function. Requires eval.
 * 构建一个 getter 函数。
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 * 使用 try/catch 隔离了代码，但并不影响在未执行时的优化。
 *
 * @param {String} body
 * @return {Function|undefined}
 */
var makeGetterFn = function makeGetterFn(body) {
    try {
        /* jshint evil: true */
        return new Function(SCOPE, 'return ' + body + ';');
    } catch (e) {
        throw new SyntaxError(
            'Invalid expression. ' +
            'Generated function body: ' + body
        );
    }
};


/**
 * Rewrite an expression, prefixing all path accessors with
 * `scope.` and generate getter/setter functions.
 * 重写表达式，添加访问器`scope.`前缀，并生成 getter/setter 方法。
 *
 * @param {String} exp 表达式
 * @return {Function}
 */
var compileGetter = function compileGetter(exp) {
    if (improperKeywordsRE.test(exp)) {
        throw new SyntaxError(
            'Avoid using reserved keywords in expression: ' + exp
        );
    }
    // reset state
    saved.length = 0;
    // save strings and object literal keys
    var body = exp
        .replace(saveRE, saveExp)
        .replace(wsRE, '');
    // rewrite all paths
    // pad 1 space here becaue the regex matches 1 extra char
    body = (' ' + body)
        .replace(identRE, rewriteExp)
        .replace(restoreRE, restoreExp);

    return makeGetterFn(body);
};


/**
 * Check if an expression is a simple path.
 * 检查表达式是否为简单路径。
 *
 * @param {String} exp 表达式
 * @return {Boolean}
 */
var isSimplePath = exports.isSimplePath = function isSimplePath(exp) {
    return pathTestRE.test(exp) &&
        // don't treat true/false as paths
        !booleanLiteralRE.test(exp) &&
        // Math constants e.g. Math.PI, Math.E etc.
        exp.slice(0, 5) !== 'Math.';
};


/**
 * Parse an expression into re-written getter
 * 解析表达式为可写的 getter 和 setter
 *
 * @param {String} exp 表达式
 * @return {Function}
 */
module.exports = function parseExpression(exp) {
    exp = exp.trim();

    var isSimple = isSimplePath(exp) && exp.indexOf('[') < 0;

    return isSimple ?
        // optimized super simple getter
        makeGetterFn(SCOPE + '.' + exp) :
        // dynamic getter
        compileGetter(exp);
};


// module.exports = function (expression) {
//     var keyName = varible();
//     var scopeName = varible();
//     var evalStrName = varible();
//     var monitorName = varible();
//     var directiveName = varible();
//     var errorName = varible();
//
//     var body =
//         // 定义执行变量
//         'var ' + evalStrName + ' = "";' +
//         'for (var ' + keyName + ' in ' + scopeName + ') {' +
//         /****/evalStrName + ' += " var " + ' + keyName + " + \' = " + scopeName + "[\"\' + " + keyName + " + \'\"];\'" +
//         '}' +
//         // 执行注入变量
//         'eval(' + evalStrName + ');' +
//         // 设置监听指向，因为上面 eval 执行的时候也会指向 define get，但真正指向在下面的表达式里
//         'if (' + monitorName + ' && ' + directiveName + ') {' +
//         /****/monitorName + '.target = ' + directiveName + ';' +
//         '}' +
//         // 表达式的健壮性
//         'try {' +
//         /****/'return ' + expression + ';' +
//         '} catch(' + errorName + ') {' +
//         /****/'if (typeof DEBUG !== "undefined" && DEBUG) {' +
//         /****//****/'return ' + errorName + '.message;' +
//         /****/'}' +
//         /****/'return "";' +
//         '}';
//
//     try {
//         return new Function(scopeName, monitorName, directiveName, body);
//     } catch (err) {
//         if (typeof DEBUG !== 'undefined' && DEBUG) {
//             console.error('表达式书写有误：');
//             console.error(expression);
//             console.error(err.stack);
//
//             return function () {
//                 return err.message;
//             };
//         }
//
//         return function () {
//             return '';
//         };
//     }
// };

