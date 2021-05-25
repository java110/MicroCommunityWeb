(function(vc){
    vc.extends({
        propTypes: {
           emitChooseSystemGoldSetting:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseSystemGoldSettingInfo:{
                systemGoldSettings:[],
                _currentSystemGoldSettingName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseSystemGoldSetting','openChooseSystemGoldSettingModel',function(_param){
                $('#chooseSystemGoldSettingModel').modal('show');
                vc.component._refreshChooseSystemGoldSettingInfo();
                vc.component._loadAllSystemGoldSettingInfo(1,10,'');
            });
        },
        methods:{
            _loadAllSystemGoldSettingInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('systemGoldSetting.listSystemGoldSettings',
                             param,
                             function(json){
                                var _systemGoldSettingInfo = JSON.parse(json);
                                vc.component.chooseSystemGoldSettingInfo.systemGoldSettings = _systemGoldSettingInfo.systemGoldSettings;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseSystemGoldSetting:function(_systemGoldSetting){
                if(_systemGoldSetting.hasOwnProperty('name')){
                     _systemGoldSetting.systemGoldSettingName = _systemGoldSetting.name;
                }
                vc.emit($props.emitChooseSystemGoldSetting,'chooseSystemGoldSetting',_systemGoldSetting);
                vc.emit($props.emitLoadData,'listSystemGoldSettingData',{
                    systemGoldSettingId:_systemGoldSetting.systemGoldSettingId
                });
                $('#chooseSystemGoldSettingModel').modal('hide');
            },
            querySystemGoldSettings:function(){
                vc.component._loadAllSystemGoldSettingInfo(1,10,vc.component.chooseSystemGoldSettingInfo._currentSystemGoldSettingName);
            },
            _refreshChooseSystemGoldSettingInfo:function(){
                vc.component.chooseSystemGoldSettingInfo._currentSystemGoldSettingName = "";
            }
        }

    });
})(window.vc);
