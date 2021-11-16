/**
    小程序管理 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewSmallWeChatInfo:{
                index:0,
                flowComponent:'viewSmallWeChatInfo',
                name:'',
appId:'',
appSecret:'',
payPassword:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadSmallWeChatInfoData();
        },
        _initEvent:function(){
            vc.on('viewSmallWeChatInfo','chooseSmallWeChat',function(_app){
                vc.copyObject(_app, vc.component.viewSmallWeChatInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewSmallWeChatInfo);
            });

            vc.on('viewSmallWeChatInfo', 'onIndex', function(_index){
                vc.component.viewSmallWeChatInfo.index = _index;
            });

        },
        methods:{

            _openSelectSmallWeChatInfoModel(){
                vc.emit('chooseSmallWeChat','openChooseSmallWeChatModel',{});
            },
            _openAddSmallWeChatInfoModel(){
                vc.emit('addSmallWeChat','openAddSmallWeChatModal',{});
            },
            _loadSmallWeChatInfoData:function(){

            }
        }
    });

})(window.vc);
