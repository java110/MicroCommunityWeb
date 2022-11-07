(function(vc,vm){

    vc.extends({
        data:{
            deleteEquipmentAccountInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteEquipmentAccount','openDeleteEquipmentAccountModal',function(_params){

                vc.component.deleteEquipmentAccountInfo = _params;
                $('#deleteEquipmentAccountModel').modal('show');

            });
        },
        methods:{
            deleteEquipmentAccount:function(){
                vc.component.deleteEquipmentAccountInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'equipmentAccount.deleteEquipmentAccount',
                    JSON.stringify(vc.component.deleteEquipmentAccountInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteEquipmentAccountModel').modal('hide');
                            vc.emit('equipmentAccount', 'listEquipmentAccounts', {});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteEquipmentAccountModel:function(){
                $('#deleteEquipmentAccountModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
