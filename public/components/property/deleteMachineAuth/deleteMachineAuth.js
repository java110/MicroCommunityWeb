(function(vc,vm){

    vc.extends({
        data:{
            deleteMachineAuthInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMachineAuth','openDeleteMachineAuthModal',function(_params){

                vc.component.deleteMachineAuthInfo = _params;
                $('#deleteMachineAuthModel').modal('show');

            });
        },
        methods:{
            deleteMachineAuth:function(){
                vc.component.deleteMachineAuthInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'machineAuth.deleteMachineAuth',
                    JSON.stringify(vc.component.deleteMachineAuthInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMachineAuthModel').modal('hide');
                            vc.emit('machineAuthManage','listMachineAuth',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMachineAuthModel:function(){
                $('#deleteMachineAuthModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
