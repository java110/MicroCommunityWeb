(function(vc,vm){

    vc.extends({
        data:{
            deleteMaintainancePlanMachineInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMaintainancePlanMachine','openDeleteMaintainancePlanMachineModal',function(_params){

                vc.component.deleteMaintainancePlanMachineInfo = _params;
                $('#deleteMaintainancePlanMachineModel').modal('show');

            });
        },
        methods:{
            deleteMaintainancePlanMachine:function(){
                vc.component.deleteMaintainancePlanMachineInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/maintainancePlan.deleteMaintainancePlanMachine',
                    JSON.stringify(vc.component.deleteMaintainancePlanMachineInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if(_json.code == 0){
                            //关闭model
                            $('#deleteMaintainancePlanMachineModel').modal('hide');
                            vc.emit('maintainancePlanMachine', 'loadMachine',$that.deleteMaintainancePlanMachineInfo);
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closedeleteMaintainancePlanMachineModel:function(){
                $('#deleteMaintainancePlanMachineModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
