(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMachineType:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMachineTypeInfo:{
                machineTypes:[],
                _currentMachineTypeName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMachineType','openChooseMachineTypeModel',function(_param){
                $('#chooseMachineTypeModel').modal('show');
                vc.component._refreshChooseMachineTypeInfo();
                vc.component._loadAllMachineTypeInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMachineTypeInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('machineType.listMachineTypes',
                             param,
                             function(json){
                                var _machineTypeInfo = JSON.parse(json);
                                vc.component.chooseMachineTypeInfo.machineTypes = _machineTypeInfo.machineTypes;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMachineType:function(_machineType){
                if(_machineType.hasOwnProperty('name')){
                     _machineType.machineTypeName = _machineType.name;
                }
                vc.emit($props.emitChooseMachineType,'chooseMachineType',_machineType);
                vc.emit($props.emitLoadData,'listMachineTypeData',{
                    machineTypeId:_machineType.machineTypeId
                });
                $('#chooseMachineTypeModel').modal('hide');
            },
            queryMachineTypes:function(){
                vc.component._loadAllMachineTypeInfo(1,10,vc.component.chooseMachineTypeInfo._currentMachineTypeName);
            },
            _refreshChooseMachineTypeInfo:function(){
                vc.component.chooseMachineTypeInfo._currentMachineTypeName = "";
            }
        }

    });
})(window.vc);
