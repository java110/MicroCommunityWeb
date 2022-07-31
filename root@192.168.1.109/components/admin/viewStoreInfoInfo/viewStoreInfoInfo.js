/**
    商户信息管理 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewStoreInfoInfo:{
                index:0,
                flowComponent:'viewStoreInfoInfo',
                name:'',
icon:'',
tel:'',
site:'',
seq:'',
workTime:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadStoreInfoInfoData();
        },
        _initEvent:function(){
            vc.on('viewStoreInfoInfo','chooseStoreInfo',function(_app){
                vc.copyObject(_app, vc.component.viewStoreInfoInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewStoreInfoInfo);
            });

            vc.on('viewStoreInfoInfo', 'onIndex', function(_index){
                vc.component.viewStoreInfoInfo.index = _index;
            });

        },
        methods:{

            _openSelectStoreInfoInfoModel(){
                vc.emit('chooseStoreInfo','openChooseStoreInfoModel',{});
            },
            _openAddStoreInfoInfoModel(){
                vc.emit('addStoreInfo','openAddStoreInfoModal',{});
            },
            _loadStoreInfoInfoData:function(){

            }
        }
    });

})(window.vc);
