(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMeterWater:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMeterWaterInfo:{
                meterWaters:[],
                _currentMeterWaterName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMeterWater','openChooseMeterWaterModel',function(_param){
                $('#chooseMeterWaterModel').modal('show');
                vc.component._refreshChooseMeterWaterInfo();
                vc.component._loadAllMeterWaterInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMeterWaterInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('meterWater.listMeterWaters',
                             param,
                             function(json){
                                var _meterWaterInfo = JSON.parse(json);
                                vc.component.chooseMeterWaterInfo.meterWaters = _meterWaterInfo.meterWaters;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMeterWater:function(_meterWater){
                if(_meterWater.hasOwnProperty('name')){
                     _meterWater.meterWaterName = _meterWater.name;
                }
                vc.emit($props.emitChooseMeterWater,'chooseMeterWater',_meterWater);
                vc.emit($props.emitLoadData,'listMeterWaterData',{
                    meterWaterId:_meterWater.meterWaterId
                });
                $('#chooseMeterWaterModel').modal('hide');
            },
            queryMeterWaters:function(){
                vc.component._loadAllMeterWaterInfo(1,10,vc.component.chooseMeterWaterInfo._currentMeterWaterName);
            },
            _refreshChooseMeterWaterInfo:function(){
                vc.component.chooseMeterWaterInfo._currentMeterWaterName = "";
            }
        }

    });
})(window.vc);
