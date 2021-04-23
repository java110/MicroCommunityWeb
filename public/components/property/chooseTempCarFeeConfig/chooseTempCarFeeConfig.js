(function(vc){
    vc.extends({
        propTypes: {
           emitChooseTempCarFeeConfig:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseTempCarFeeConfigInfo:{
                tempCarFeeConfigs:[],
                _currentTempCarFeeConfigName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseTempCarFeeConfig','openChooseTempCarFeeConfigModel',function(_param){
                $('#chooseTempCarFeeConfigModel').modal('show');
                vc.component._refreshChooseTempCarFeeConfigInfo();
                vc.component._loadAllTempCarFeeConfigInfo(1,10,'');
            });
        },
        methods:{
            _loadAllTempCarFeeConfigInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('tempCarFeeConfig.listTempCarFeeConfigs',
                             param,
                             function(json){
                                var _tempCarFeeConfigInfo = JSON.parse(json);
                                vc.component.chooseTempCarFeeConfigInfo.tempCarFeeConfigs = _tempCarFeeConfigInfo.tempCarFeeConfigs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseTempCarFeeConfig:function(_tempCarFeeConfig){
                if(_tempCarFeeConfig.hasOwnProperty('name')){
                     _tempCarFeeConfig.tempCarFeeConfigName = _tempCarFeeConfig.name;
                }
                vc.emit($props.emitChooseTempCarFeeConfig,'chooseTempCarFeeConfig',_tempCarFeeConfig);
                vc.emit($props.emitLoadData,'listTempCarFeeConfigData',{
                    tempCarFeeConfigId:_tempCarFeeConfig.tempCarFeeConfigId
                });
                $('#chooseTempCarFeeConfigModel').modal('hide');
            },
            queryTempCarFeeConfigs:function(){
                vc.component._loadAllTempCarFeeConfigInfo(1,10,vc.component.chooseTempCarFeeConfigInfo._currentTempCarFeeConfigName);
            },
            _refreshChooseTempCarFeeConfigInfo:function(){
                vc.component.chooseTempCarFeeConfigInfo._currentTempCarFeeConfigName = "";
            }
        }

    });
})(window.vc);
