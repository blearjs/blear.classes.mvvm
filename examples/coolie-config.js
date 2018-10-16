/**
 * ======================================================
 * coolie.js 配置文件 `coolie-config.js`
 * 使用 `coolie init -j` 生成 `coolie-config.js` 文件模板
 * 前端模块加载器配置文件
 *
 * @link https://coolie.ydr.me/guide/coolie-config.js/
 * @author ydr.me
 * @version 2.7.3
 * @create 2018-10-16 11:38:31
 * ======================================================
 */

coolie.config({
    // 模块模式，开发环境为 COMMONJS，
    // 如果你模块规范是 CMD，请填写为 CMD
    mode: 'CJS',

    // 入口模块基准路径，相对于当前文件
    mainModulesDir: '/examples/',

    // node_modules 目录指向，相对于 mainModulesDir
    nodeModulesDir: '/node_modules/',

    // 手动指定 node 模块的入口文件，此时将不会去加载模块的 package.json
    // 除非你非常肯定，你加载的 node 模块的入口路径都是一致的
    // 否则不要修改配置此项
    nodeModuleMainPath: 'src/index.js',

    // 是否为调试模式，构建之后会修改为 false
    debug: true,

    // 全局变量，用于模块构建的预定义变量判断压缩
    global: {}
}).use();