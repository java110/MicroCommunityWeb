(function(vc){
    vc.extends({
        propTypes: {
           emitChooseRepairSetting:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseRepairSettingInfo:{
                repairSettings:[],
                _currentRepairSettingName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseRepairSetting','openChooseRepairSettingModel',function(_param){
                $('#chooseRepairSettingModel').modal('show');
                vc.component._refreshChooseRepairSettingInfo();
                vc.component._loadAllRepairSettingInfo(1,10,'');
            });
        },
        methods:{
            _loadAllRepairSettingInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('repairSetting.listRepairSettings',
                             param,
                             function(json){
                                var _repairSettingInfo = JSON.parse(json);
                                vc.component.chooseRepairSettingInfo.repairSettings = _repairSettingInfo.repairSettings;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseRepairSetting:function(_repairSetting){
                if(_repairSetting.hasOwnProperty('name')){
                     _repairSetting.repairSettingName = _repairSetting.name;
                }
                vc.emit($props.emitChooseRepairSetting,'chooseRepairSetting',_repairSetting);
                vc.emit($props.emitLoadData,'listRepairSettingData',{
                    repairSettingId:_repairSetting.repairSettingId
                });
                $('#chooseRepairSettingModel').modal('hide');
            },
            queryRepairSettings:function(){
                vc.component._loadAllRepairSettingInfo(1,10,vc.component.chooseRepairSettingInfo._currentRepairSettingName);
            },
            _refreshChooseRepairSettingInfo:function(){
                vc.component.chooseRepairSettingInfo._currentRepairSettingName = "";
            }
        }

    });
})(window.vc);
