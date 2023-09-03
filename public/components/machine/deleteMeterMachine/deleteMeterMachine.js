(function(vc,vm){

    vc.extends({
        data:{
            deleteMeterMachineInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMeterMachine','openDeleteMeterMachineModal',function(_params){

                vc.component.deleteMeterMachineInfo = _params;
                $('#deleteMeterMachineModel').modal('show');

            });
        },
        methods:{
            deleteMeterMachine:function(){
                vc.component.deleteMeterMachineInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/meterMachine.deleteMeterMachine',
                    JSON.stringify(vc.component.deleteMeterMachineInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMeterMachineModel').modal('hide');
                            vc.emit('meterMachineManage','listMeterMachine',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMeterMachineModel:function(){
                $('#deleteMeterMachineModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
