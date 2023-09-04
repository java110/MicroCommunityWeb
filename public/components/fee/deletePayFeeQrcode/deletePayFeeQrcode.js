(function(vc,vm){

    vc.extends({
        data:{
            deletePayFeeQrcodeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deletePayFeeQrcode','openDeletePayFeeQrcodeModal',function(_params){

                $that.deletePayFeeQrcodeInfo = _params;
                $('#deletePayFeeQrcodeModel').modal('show');

            });
        },
        methods:{
            deletePayFeeQrcode:function(){
                $that.deletePayFeeQrcodeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/payFeeQrcode.deletePayFeeQrcode',
                    JSON.stringify($that.deletePayFeeQrcodeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePayFeeQrcodeModel').modal('hide');
                            vc.emit('payFeeQrcode','listPayFeeQrcode',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeletePayFeeQrcodeModel:function(){
                $('#deletePayFeeQrcodeModel').modal('hide');
            }
        }
    });

})(window.vc,window.$that);
