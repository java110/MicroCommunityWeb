/**
    活动规则 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewActivitiesRuleInfo:{
                index:0,
                flowComponent:'viewActivitiesRuleInfo',
                ruleType:'',
ruleName:'',
startTime:'',
endTime:'',
activitiesObj:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadActivitiesRuleInfoData();
        },
        _initEvent:function(){
            vc.on('viewActivitiesRuleInfo','chooseActivitiesRule',function(_app){
                vc.copyObject(_app, vc.component.viewActivitiesRuleInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewActivitiesRuleInfo);
            });

            vc.on('viewActivitiesRuleInfo', 'onIndex', function(_index){
                vc.component.viewActivitiesRuleInfo.index = _index;
            });

        },
        methods:{

            _openSelectActivitiesRuleInfoModel(){
                vc.emit('chooseActivitiesRule','openChooseActivitiesRuleModel',{});
            },
            _openAddActivitiesRuleInfoModel(){
                vc.emit('addActivitiesRule','openAddActivitiesRuleModal',{});
            },
            _loadActivitiesRuleInfoData:function(){

            }
        }
    });

})(window.vc);
