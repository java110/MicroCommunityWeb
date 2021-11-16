(function(vc){
    vc.extends({
        propTypes: {
           emitChooseComponentCondition:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseComponentConditionInfo:{
                componentConditions:[],
                _currentComponentConditionName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseComponentCondition','openChooseComponentConditionModel',function(_param){
                $('#chooseComponentConditionModel').modal('show');
                vc.component._refreshChooseComponentConditionInfo();
                vc.component._loadAllComponentConditionInfo(1,10,'');
            });
        },
        methods:{
            _loadAllComponentConditionInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('componentCondition.listComponentConditions',
                             param,
                             function(json){
                                var _componentConditionInfo = JSON.parse(json);
                                vc.component.chooseComponentConditionInfo.componentConditions = _componentConditionInfo.componentConditions;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseComponentCondition:function(_componentCondition){
                if(_componentCondition.hasOwnProperty('name')){
                     _componentCondition.componentConditionName = _componentCondition.name;
                }
                vc.emit($props.emitChooseComponentCondition,'chooseComponentCondition',_componentCondition);
                vc.emit($props.emitLoadData,'listComponentConditionData',{
                    componentConditionId:_componentCondition.componentConditionId
                });
                $('#chooseComponentConditionModel').modal('hide');
            },
            queryComponentConditions:function(){
                vc.component._loadAllComponentConditionInfo(1,10,vc.component.chooseComponentConditionInfo._currentComponentConditionName);
            },
            _refreshChooseComponentConditionInfo:function(){
                vc.component.chooseComponentConditionInfo._currentComponentConditionName = "";
            }
        }

    });
})(window.vc);
