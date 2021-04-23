(function(vc){
    vc.extends({
        propTypes: {
           emitChooseGroupBuySetting:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseGroupBuySettingInfo:{
                groupBuySettings:[],
                _currentGroupBuySettingName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseGroupBuySetting','openChooseGroupBuySettingModel',function(_param){
                $('#chooseGroupBuySettingModel').modal('show');
                vc.component._refreshChooseGroupBuySettingInfo();
                vc.component._loadAllGroupBuySettingInfo(1,10,'');
            });
        },
        methods:{
            _loadAllGroupBuySettingInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('groupBuySetting.listGroupBuySettings',
                             param,
                             function(json){
                                var _groupBuySettingInfo = JSON.parse(json);
                                vc.component.chooseGroupBuySettingInfo.groupBuySettings = _groupBuySettingInfo.groupBuySettings;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseGroupBuySetting:function(_groupBuySetting){
                if(_groupBuySetting.hasOwnProperty('name')){
                     _groupBuySetting.groupBuySettingName = _groupBuySetting.name;
                }
                vc.emit($props.emitChooseGroupBuySetting,'chooseGroupBuySetting',_groupBuySetting);
                vc.emit($props.emitLoadData,'listGroupBuySettingData',{
                    groupBuySettingId:_groupBuySetting.groupBuySettingId
                });
                $('#chooseGroupBuySettingModel').modal('hide');
            },
            queryGroupBuySettings:function(){
                vc.component._loadAllGroupBuySettingInfo(1,10,vc.component.chooseGroupBuySettingInfo._currentGroupBuySettingName);
            },
            _refreshChooseGroupBuySettingInfo:function(){
                vc.component.chooseGroupBuySettingInfo._currentGroupBuySettingName = "";
            }
        }

    });
})(window.vc);
