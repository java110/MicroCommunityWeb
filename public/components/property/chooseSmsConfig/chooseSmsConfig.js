(function(vc){
    vc.extends({
        propTypes: {
           emitChooseSmsConfig:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseSmsConfigInfo:{
                smsConfigs:[],
                _currentSmsConfigName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseSmsConfig','openChooseSmsConfigModel',function(_param){
                $('#chooseSmsConfigModel').modal('show');
                vc.component._refreshChooseSmsConfigInfo();
                vc.component._loadAllSmsConfigInfo(1,10,'');
            });
        },
        methods:{
            _loadAllSmsConfigInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('smsConfig.listSmsConfigs',
                             param,
                             function(json){
                                var _smsConfigInfo = JSON.parse(json);
                                vc.component.chooseSmsConfigInfo.smsConfigs = _smsConfigInfo.smsConfigs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseSmsConfig:function(_smsConfig){
                if(_smsConfig.hasOwnProperty('name')){
                     _smsConfig.smsConfigName = _smsConfig.name;
                }
                vc.emit($props.emitChooseSmsConfig,'chooseSmsConfig',_smsConfig);
                vc.emit($props.emitLoadData,'listSmsConfigData',{
                    smsConfigId:_smsConfig.smsConfigId
                });
                $('#chooseSmsConfigModel').modal('hide');
            },
            querySmsConfigs:function(){
                vc.component._loadAllSmsConfigInfo(1,10,vc.component.chooseSmsConfigInfo._currentSmsConfigName);
            },
            _refreshChooseSmsConfigInfo:function(){
                vc.component.chooseSmsConfigInfo._currentSmsConfigName = "";
            }
        }

    });
})(window.vc);
