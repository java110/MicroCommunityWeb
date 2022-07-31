/**
    供应商 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewChainSupplierInfo:{
                index:0,
                flowComponent:'viewChainSupplierInfo',
                name:'',
appId:'',
appSecure:'',
mchId:'',
mchKey:'',
url:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadChainSupplierInfoData();
        },
        _initEvent:function(){
            vc.on('viewChainSupplierInfo','chooseChainSupplier',function(_app){
                vc.copyObject(_app, vc.component.viewChainSupplierInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewChainSupplierInfo);
            });

            vc.on('viewChainSupplierInfo', 'onIndex', function(_index){
                vc.component.viewChainSupplierInfo.index = _index;
            });

        },
        methods:{

            _openSelectChainSupplierInfoModel(){
                vc.emit('chooseChainSupplier','openChooseChainSupplierModel',{});
            },
            _openAddChainSupplierInfoModel(){
                vc.emit('addChainSupplier','openAddChainSupplierModal',{});
            },
            _loadChainSupplierInfoData:function(){

            }
        }
    });

})(window.vc);
