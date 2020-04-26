/**
    旧货 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewJunkRequirementInfo:{
                index:0,
                flowComponent:'viewJunkRequirementInfo',
                classification:'',
inspectionPlanId:'',
context:'',
referencePrice:'',
publishUserName:'',
publishUserLink:'',
state:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadJunkRequirementInfoData();
        },
        _initEvent:function(){
            vc.on('viewJunkRequirementInfo','chooseJunkRequirement',function(_app){
                vc.copyObject(_app, vc.component.viewJunkRequirementInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewJunkRequirementInfo);
            });

            vc.on('viewJunkRequirementInfo', 'onIndex', function(_index){
                vc.component.viewJunkRequirementInfo.index = _index;
            });

        },
        methods:{

            _openSelectJunkRequirementInfoModel(){
                vc.emit('chooseJunkRequirement','openChooseJunkRequirementModel',{});
            },
            _openAddJunkRequirementInfoModel(){
                vc.emit('addJunkRequirement','openAddJunkRequirementModal',{});
            },
            _loadJunkRequirementInfoData:function(){

            }
        }
    });

})(window.vc);
