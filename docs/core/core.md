## vcFramework 核心介绍

$that 为一个vue对象(为兼容0.1 版本 vc.component 也是为一个vue对象)，在页面加载最后去创建，页面组件中只存在一个vue对象，也就是多个组件公用一个vue对象，是用vc.extends()方法去继承 vue对象，extends参数介绍如下：

>vc.extends({
>        propTypes: {
>
>        },
>        data:{
>
>        },
>        watch:function(){
>        },
>        _initMethod:function(){
>
>        },
>        _initEvent:function(){
>
>        },
>        methods:{
>
>        }
>    });

### propTypes节点

组件参数，一般情况下这个节点可以不用写，只有 引入组件时，需要传参时，才会用到。

### data节点

data节点就是vue的data节点用作数据绑定，data下的最好是一个对象，对象名取名为当前组件名+info组成，对象下再去写需要绑定的字段信息，这样做的目的是为 多个组件之间取相同的字段名称 导致影响显示效果。

### watch节点

watch节点为 vue的watch节点




