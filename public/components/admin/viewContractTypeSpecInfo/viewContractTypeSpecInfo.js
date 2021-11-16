/**
    合同类型属性 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewContractTypeSpecInfo:{
                index:0,
                flowComponent:'viewContractTypeSpecInfo',
                specName:'',
specHoldplace:'',
required:'',
specShow:'',
specValueType:'',
specType:'',
listShow:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadContractTypeSpecInfoData();
        },
        _initEvent:function(){
            vc.on('viewContractTypeSpecInfo','chooseContractTypeSpec',function(_app){
                vc.copyObject(_app, vc.component.viewContractTypeSpecInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewContractTypeSpecInfo);
            });

            vc.on('viewContractTypeSpecInfo', 'onIndex', function(_index){
                vc.component.viewContractTypeSpecInfo.index = _index;
            });

        },
        methods:{

            _openSelectContractTypeSpecInfoModel(){
                vc.emit('chooseContractTypeSpec','openChooseContractTypeSpecModel',{});
            },
            _openAddContractTypeSpecInfoModel(){
                vc.emit('addContractTypeSpec','openAddContractTypeSpecModal',{});
            },
            _loadContractTypeSpecInfoData:function(){

            }
        }
    });

})(window.vc);
