(function(vc,vm){

    vc.extends({
        data:{
            deleteInvoiceApplyInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteInvoiceApply','openDeleteInvoiceApplyModal',function(_params){

                $that.deleteInvoiceApplyInfo = _params;
                $('#deleteInvoiceApplyModel').modal('show');

            });
        },
        methods:{
            deleteInvoiceApply:function(){
                $that.deleteInvoiceApplyInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/invoice.deleteInvoiceApply',
                    JSON.stringify($that.deleteInvoiceApplyInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteInvoiceApplyModel').modal('hide');
                            vc.emit('invoiceApply','listInvoiceApply',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteInvoiceApplyModel:function(){
                $('#deleteInvoiceApplyModel').modal('hide');
            }
        }
    });

})(window.vc,window.$that);
