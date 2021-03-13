(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMachineAuth:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMachineAuthInfo:{
                machineAuths:[],
                _currentMachineAuthName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMachineAuth','openChooseMachineAuthModel',function(_param){
                $('#chooseMachineAuthModel').modal('show');
                vc.component._refreshChooseMachineAuthInfo();
                vc.component._loadAllMachineAuthInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMachineAuthInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('machineAuth.listMachineAuths',
                             param,
                             function(json){
                                var _machineAuthInfo = JSON.parse(json);
                                vc.component.chooseMachineAuthInfo.machineAuths = _machineAuthInfo.machineAuths;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMachineAuth:function(_machineAuth){
                if(_machineAuth.hasOwnProperty('name')){
                     _machineAuth.machineAuthName = _machineAuth.name;
                }
                vc.emit($props.emitChooseMachineAuth,'chooseMachineAuth',_machineAuth);
                vc.emit($props.emitLoadData,'listMachineAuthData',{
                    machineAuthId:_machineAuth.machineAuthId
                });
                $('#chooseMachineAuthModel').modal('hide');
            },
            queryMachineAuths:function(){
                vc.component._loadAllMachineAuthInfo(1,10,vc.component.chooseMachineAuthInfo._currentMachineAuthName);
            },
            _refreshChooseMachineAuthInfo:function(){
                vc.component.chooseMachineAuthInfo._currentMachineAuthName = "";
            }
        }

    });
})(window.vc);
