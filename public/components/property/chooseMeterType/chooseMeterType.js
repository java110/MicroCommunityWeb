(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMeterType:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMeterTypeInfo:{
                meterTypes:[],
                _currentMeterTypeName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMeterType','openChooseMeterTypeModel',function(_param){
                $('#chooseMeterTypeModel').modal('show');
                vc.component._refreshChooseMeterTypeInfo();
                vc.component._loadAllMeterTypeInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMeterTypeInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('meterType.listMeterTypes',
                             param,
                             function(json){
                                var _meterTypeInfo = JSON.parse(json);
                                vc.component.chooseMeterTypeInfo.meterTypes = _meterTypeInfo.meterTypes;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMeterType:function(_meterType){
                if(_meterType.hasOwnProperty('name')){
                     _meterType.meterTypeName = _meterType.name;
                }
                vc.emit($props.emitChooseMeterType,'chooseMeterType',_meterType);
                vc.emit($props.emitLoadData,'listMeterTypeData',{
                    meterTypeId:_meterType.meterTypeId
                });
                $('#chooseMeterTypeModel').modal('hide');
            },
            queryMeterTypes:function(){
                vc.component._loadAllMeterTypeInfo(1,10,vc.component.chooseMeterTypeInfo._currentMeterTypeName);
            },
            _refreshChooseMeterTypeInfo:function(){
                vc.component.chooseMeterTypeInfo._currentMeterTypeName = "";
            }
        }

    });
})(window.vc);
