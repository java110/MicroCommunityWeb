(function(vc,vm){

    vc.extends({
        data:{
            deleteShopAuditInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteShopAudit','openDeleteShopAuditModal',function(_params){

                vc.component.deleteShopAuditInfo = _params;
                $('#deleteShopAuditModel').modal('show');

            });
        },
        methods:{
            deleteShopAudit:function(){
                vc.component.deleteShopAuditInfo.caId=vc.getCurrentCommunity().caId;
                vc.http.apiPost(
                    '/shopAudit/deleteShopAudit',
                    JSON.stringify(vc.component.deleteShopAuditInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteShopAuditModel').modal('hide');
                            vc.emit('shopAuditManage','listShopAudit',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteShopAuditModel:function(){
                $('#deleteShopAuditModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
