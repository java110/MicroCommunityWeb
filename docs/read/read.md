## 介绍

### vcFramework 是什么
  vcFramework 是一套 依赖于vue的前段组件化开发的套件，设计之初主要是为了解决前段不在依赖后端java等情况下完成组件化开发，也是为了改造HC小区管理系统为前后端分离系统。将一个目录下的HTML 文件和同名的JS文件定义为一个组件。

### 组件样例

#### 组件引入

> <div>
>   <vc:create name='helloword'>
> </div>

#### 组件定义

1、HTML部分 文件名为 helloword.html

>    <div>{{helloWordInfo.hello}}</div>

2、JS部分 文件名为 helloword.js

>    (function (vc) {
>    vc.extends({
>        data: {
>            helloWordInfo: {
>                // 这里是 变量定义
>                hello:'hello word'
>            }
>        },
>        _initMethod: function () {
>            // 初始化方法
>        },
>        _initEvent: function () {
>            //这里是事件侦听
>        },
>        methods: {
>            a: function () {}
>        }
>    });
>})(window.vc);

我们已经成功的构建了一个组件，可以在任何地方调用