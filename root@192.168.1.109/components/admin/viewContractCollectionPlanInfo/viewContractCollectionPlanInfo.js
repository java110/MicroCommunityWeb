/**
    收款计划 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewContractCollectionPlanInfo:{
                index:0,
                flowComponent:'viewContractCollectionPlanInfo',
                planName:'',
contractCode:'',
feeName:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadContractCollectionPlanInfoData();
        },
        _initEvent:function(){
            vc.on('viewContractCollectionPlanInfo','chooseContractCollectionPlan',function(_app){
                vc.copyObject(_app, vc.component.viewContractCollectionPlanInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewContractCollectionPlanInfo);
            });

            vc.on('viewContractCollectionPlanInfo', 'onIndex', function(_index){
                vc.component.viewContractCollectionPlanInfo.index = _index;
            });

        },
        methods:{

            _openSelectContractCollectionPlanInfoModel(){
                vc.emit('chooseContractCollectionPlan','openChooseContractCollectionPlanModel',{});
            },
            _openAddContractCollectionPlanInfoModel(){
                vc.emit('addContractCollectionPlan','openAddContractCollectionPlanModal',{});
            },
            _loadContractCollectionPlanInfoData:function(){

            }
        }
    });

})(window.vc);
