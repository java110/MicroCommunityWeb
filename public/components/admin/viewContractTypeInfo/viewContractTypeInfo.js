/**
    合同类型 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewContractTypeInfo:{
                index:0,
                flowComponent:'viewContractTypeInfo',
                typeName:'',
audit:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadContractTypeInfoData();
        },
        _initEvent:function(){
            vc.on('viewContractTypeInfo','chooseContractType',function(_app){
                vc.copyObject(_app, vc.component.viewContractTypeInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewContractTypeInfo);
            });

            vc.on('viewContractTypeInfo', 'onIndex', function(_index){
                vc.component.viewContractTypeInfo.index = _index;
            });

        },
        methods:{

            _openSelectContractTypeInfoModel(){
                vc.emit('chooseContractType','openChooseContractTypeModel',{});
            },
            _openAddContractTypeInfoModel(){
                vc.emit('addContractType','openAddContractTypeModal',{});
            },
            _loadContractTypeInfoData:function(){

            }
        }
    });

})(window.vc);
