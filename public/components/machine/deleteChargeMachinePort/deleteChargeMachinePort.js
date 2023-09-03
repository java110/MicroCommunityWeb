(function(vc,vm){

    vc.extends({
        data:{
            deleteChargeMachinePortInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteChargeMachinePort','openDeleteChargeMachinePortModal',function(_params){

                vc.component.deleteChargeMachinePortInfo = _params;
                $('#deleteChargeMachinePortModel').modal('show');

            });
        },
        methods:{
            deleteChargeMachinePort:function(){
                vc.component.deleteChargeMachinePortInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/chargeMachine.deleteChargeMachinePort',
                    JSON.stringify(vc.component.deleteChargeMachinePortInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteChargeMachinePortModel').modal('hide');
                            vc.emit('chargeMachinePortManage','listChargeMachinePort',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteChargeMachinePortModel:function(){
                $('#deleteChargeMachinePortModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
