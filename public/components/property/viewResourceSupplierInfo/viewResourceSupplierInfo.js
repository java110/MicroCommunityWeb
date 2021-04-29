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
            viewResourceSupplierInfo:{
                index:0,
                flowComponent:'viewResourceSupplierInfo',
                supplierName:'',
address:'',
tel:'',
contactName:'',
accountBank:'',
bankAccountNumber:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadResourceSupplierInfoData();
        },
        _initEvent:function(){
            vc.on('viewResourceSupplierInfo','chooseResourceSupplier',function(_app){
                vc.copyObject(_app, vc.component.viewResourceSupplierInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewResourceSupplierInfo);
            });

            vc.on('viewResourceSupplierInfo', 'onIndex', function(_index){
                vc.component.viewResourceSupplierInfo.index = _index;
            });

        },
        methods:{

            _openSelectResourceSupplierInfoModel(){
                vc.emit('chooseResourceSupplier','openChooseResourceSupplierModel',{});
            },
            _openAddResourceSupplierInfoModel(){
                vc.emit('addResourceSupplier','openAddResourceSupplierModal',{});
            },
            _loadResourceSupplierInfoData:function(){

            }
        }
    });

})(window.vc);
