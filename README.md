# sparky

> 基于 vue2, vue-router, vuex, axios 及 Element UI 框架，组成的 DM/OS 数人云操作系统前端界面
## 构建

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 项目结构
```javascript
├── README.md                         // 项目说明
├── build                             // 项目构建相关代码
│   ├── build.js                      // 生产环境构建代码
│   ├── check-versions.js             // 检查 node、npm 等版本
│   ├── dev-client.js                 // 热重载相关
│   ├── dev-server.js                 // 构建本地服务器
│   ├── utils.js                      // 构建工具相关
│   ├── vue-loader.conf.js            // vue-loader
│   ├── webpack.base.conf.js          // webpack 基础配置（出入口和 loader）
│   ├── webpack.dev.conf.js           // webpack 开发环境配置
│   ├── webpack.prod.conf.js          // webpack 生产环境配置
│   └── webpack.test.conf.js          // webpack 测试环境配置
├── config                            // 项目开发环境配置
│   ├── dev.env.js                    // 开发环境变量
│   ├── index.js                      // 项目一些配置变量（开发环境接口转发将在此配置）
│   ├── prod.env.js                   // 生产环境变量
│   └── test.env.js                   // 测试环境变量
├── index.html                        // 入口页面
├── package.json                      // 项目基本信息
├── src                               // 源码目录
│   ├── App.vue                       // 页面入口文件
│   ├── api                           // API 请求
│   ├── assets                        // 静态资源
│   │   └── logo.png
│   ├── components                    // vue 公共组件
│   │   └── Hello.vue
│   ├── main.js                       // 程序入口文件，加载各种公共组件
│   ├── router                        // 路由
│   │   └── index.js
│   ├── store                         // vuex 的状态管理
│   │   └── index.js
│   └── views                         // 项目页面
├── static                            // 静态文件，比如一些图片，json数据等
└── test                              // 自动化测试相关文件
    ├── e2e
    │   ├── custom-assertions
    │   ├── nightwatch.conf.js
    │   ├── runner.js
    │   └── specs
    └── unit
        ├── index.js
        ├── karma.conf.js
        └── specs
```
