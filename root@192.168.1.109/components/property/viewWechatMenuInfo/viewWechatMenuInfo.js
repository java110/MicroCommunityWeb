/**
    公众号菜单 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewWechatMenuInfo:{
                index:0,
                flowComponent:'viewWechatMenuInfo',
                menuName:'',
menuType:'',
menuLevel:'',
menuValue:'',
appId:'',
pagepath:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadWechatMenuInfoData();
        },
        _initEvent:function(){
            vc.on('viewWechatMenuInfo','chooseWechatMenu',function(_app){
                vc.copyObject(_app, vc.component.viewWechatMenuInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewWechatMenuInfo);
            });

            vc.on('viewWechatMenuInfo', 'onIndex', function(_index){
                vc.component.viewWechatMenuInfo.index = _index;
            });

        },
        methods:{

            _openSelectWechatMenuInfoModel(){
                vc.emit('chooseWechatMenu','openChooseWechatMenuModel',{});
            },
            _openAddWechatMenuInfoModel(){
                vc.emit('addWechatMenu','openAddWechatMenuModal',{});
            },
            _loadWechatMenuInfoData:function(){

            }
        }
    });

})(window.vc);
