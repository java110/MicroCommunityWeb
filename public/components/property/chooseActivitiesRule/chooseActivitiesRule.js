(function(vc){
    vc.extends({
        propTypes: {
           emitChooseActivitiesRule:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseActivitiesRuleInfo:{
                activitiesRules:[],
                _currentActivitiesRuleName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseActivitiesRule','openChooseActivitiesRuleModel',function(_param){
                $('#chooseActivitiesRuleModel').modal('show');
                vc.component._refreshChooseActivitiesRuleInfo();
                vc.component._loadAllActivitiesRuleInfo(1,10,'');
            });
        },
        methods:{
            _loadAllActivitiesRuleInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('activitiesRule.listActivitiesRules',
                             param,
                             function(json){
                                var _activitiesRuleInfo = JSON.parse(json);
                                vc.component.chooseActivitiesRuleInfo.activitiesRules = _activitiesRuleInfo.activitiesRules;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseActivitiesRule:function(_activitiesRule){
                if(_activitiesRule.hasOwnProperty('name')){
                     _activitiesRule.activitiesRuleName = _activitiesRule.name;
                }
                vc.emit($props.emitChooseActivitiesRule,'chooseActivitiesRule',_activitiesRule);
                vc.emit($props.emitLoadData,'listActivitiesRuleData',{
                    activitiesRuleId:_activitiesRule.activitiesRuleId
                });
                $('#chooseActivitiesRuleModel').modal('hide');
            },
            queryActivitiesRules:function(){
                vc.component._loadAllActivitiesRuleInfo(1,10,vc.component.chooseActivitiesRuleInfo._currentActivitiesRuleName);
            },
            _refreshChooseActivitiesRuleInfo:function(){
                vc.component.chooseActivitiesRuleInfo._currentActivitiesRuleName = "";
            }
        }

    });
})(window.vc);
