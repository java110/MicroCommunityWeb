(function(vc,vm){

    vc.extends({
        data:{
            deletePaymentPoolInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deletePaymentPool','openDeletePaymentPoolModal',function(_params){

                $that.deletePaymentPoolInfo = _params;
                $('#deletePaymentPoolModel').modal('show');

            });
        },
        methods:{
            deletePaymentPool:function(){
                $that.deletePaymentPoolInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/payment.deletePaymentPool',
                    JSON.stringify($that.deletePaymentPoolInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePaymentPoolModel').modal('hide');
                            vc.emit('paymentPool','listPaymentPool',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeletePaymentPoolModel:function(){
                $('#deletePaymentPoolModel').modal('hide');
            }
        }
    });

})(window.vc,window.$that);
