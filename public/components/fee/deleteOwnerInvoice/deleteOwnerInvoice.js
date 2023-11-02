(function(vc,vm){

    vc.extends({
        data:{
            deleteOwnerInvoiceInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteOwnerInvoice','openDeleteOwnerInvoiceModal',function(_params){

                $that.deleteOwnerInvoiceInfo = _params;
                $('#deleteOwnerInvoiceModel').modal('show');

            });
        },
        methods:{
            deleteOwnerInvoice:function(){
                $that.deleteOwnerInvoiceInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/invoice.deleteOwnerInvoice',
                    JSON.stringify($that.deleteOwnerInvoiceInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteOwnerInvoiceModel').modal('hide');
                            vc.emit('ownerInvoice','listOwnerInvoice',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteOwnerInvoiceModel:function(){
                $('#deleteOwnerInvoiceModel').modal('hide');
            }
        }
    });

})(window.vc,window.$that);
