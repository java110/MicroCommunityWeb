(function(vc,vm){

    vc.extends({
        data:{
            deleteAppUserBindingOwnerInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteAppUserBindingOwner','openDeleteAppUserBindingOwnerModal',function(_params){

                vc.component.deleteAppUserBindingOwnerInfo = _params;
                $('#deleteAppUserBindingOwnerModel').modal('show');

            });
        },
        methods:{
            deleteAppUserBindingOwner:function(){
                //vc.component.deleteAppUserBindingOwnerInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'owner.deleteAppUserBindingOwner',
                    JSON.stringify(vc.component.deleteAppUserBindingOwnerInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        //let _json = JSON.parse(json);
                        //let data = res.data;
                        if (res.status == 200) {
                            //关闭model
                            $('#deleteAppUserBindingOwnerModel').modal('hide');
                            //vc.component.clearAddAppUserBindingOwnerInfo();
                            vc.emit('auditAppUserBindingOwnerManage','listAuditAppUserBindingOwner', {});
                            return;
                        }
                        vc.toast(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(errInfo);

                     });
            },
            closeDeleteAppUserBindingOwnerModel:function(){
                $('#deleteAppUserBindingOwnerModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
