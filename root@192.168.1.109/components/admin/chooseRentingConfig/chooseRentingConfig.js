(function(vc){
    vc.extends({
        propTypes: {
           emitChooseRentingConfig:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseRentingConfigInfo:{
                rentingConfigs:[],
                _currentRentingConfigName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseRentingConfig','openChooseRentingConfigModel',function(_param){
                $('#chooseRentingConfigModel').modal('show');
                vc.component._refreshChooseRentingConfigInfo();
                vc.component._loadAllRentingConfigInfo(1,10,'');
            });
        },
        methods:{
            _loadAllRentingConfigInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('rentingConfig.listRentingConfigs',
                             param,
                             function(json){
                                var _rentingConfigInfo = JSON.parse(json);
                                vc.component.chooseRentingConfigInfo.rentingConfigs = _rentingConfigInfo.rentingConfigs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseRentingConfig:function(_rentingConfig){
                if(_rentingConfig.hasOwnProperty('name')){
                     _rentingConfig.rentingConfigName = _rentingConfig.name;
                }
                vc.emit($props.emitChooseRentingConfig,'chooseRentingConfig',_rentingConfig);
                vc.emit($props.emitLoadData,'listRentingConfigData',{
                    rentingConfigId:_rentingConfig.rentingConfigId
                });
                $('#chooseRentingConfigModel').modal('hide');
            },
            queryRentingConfigs:function(){
                vc.component._loadAllRentingConfigInfo(1,10,vc.component.chooseRentingConfigInfo._currentRentingConfigName);
            },
            _refreshChooseRentingConfigInfo:function(){
                vc.component.chooseRentingConfigInfo._currentRentingConfigName = "";
            }
        }

    });
})(window.vc);
