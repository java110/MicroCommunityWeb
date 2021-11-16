(function(vc){
    vc.extends({
        propTypes: {
           emitChooseActivitiesType:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseActivitiesTypeInfo:{
                activitiesTypes:[],
                _currentActivitiesTypeName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseActivitiesType','openChooseActivitiesTypeModel',function(_param){
                $('#chooseActivitiesTypeModel').modal('show');
                vc.component._refreshChooseActivitiesTypeInfo();
                vc.component._loadAllActivitiesTypeInfo(1,10,'');
            });
        },
        methods:{
            _loadAllActivitiesTypeInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('activitiesType.listActivitiesTypes',
                             param,
                             function(json){
                                var _activitiesTypeInfo = JSON.parse(json);
                                vc.component.chooseActivitiesTypeInfo.activitiesTypes = _activitiesTypeInfo.activitiesTypes;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseActivitiesType:function(_activitiesType){
                if(_activitiesType.hasOwnProperty('name')){
                     _activitiesType.activitiesTypeName = _activitiesType.name;
                }
                vc.emit($props.emitChooseActivitiesType,'chooseActivitiesType',_activitiesType);
                vc.emit($props.emitLoadData,'listActivitiesTypeData',{
                    activitiesTypeId:_activitiesType.activitiesTypeId
                });
                $('#chooseActivitiesTypeModel').modal('hide');
            },
            queryActivitiesTypes:function(){
                vc.component._loadAllActivitiesTypeInfo(1,10,vc.component.chooseActivitiesTypeInfo._currentActivitiesTypeName);
            },
            _refreshChooseActivitiesTypeInfo:function(){
                vc.component.chooseActivitiesTypeInfo._currentActivitiesTypeName = "";
            }
        }

    });
})(window.vc);
