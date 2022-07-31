(function(vc,vm){

    vc.extends({
        data:{
            shopWithdrawInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('shopWithdraw','shopWithdrawModel',function(_params){
                vc.component.shopWithdrawInfo = _params;
                $('#shopWithdrawModel').modal('show');

            });
        },
        methods:{
             //提交撤回信息
            updateShopWithdraw:function(){
                vc.component.shopWithdrawInfo.state = '001';
                console.log(vc.component.shopWithdrawInfo);
                //发送get请求
                vc.http.apiPost('/shop/auditShop',
                    JSON.stringify(vc.component.shopWithdrawInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json)
                        if (_json.code != 0) {
                            vc.toast(_json.msg);
                            return;
                        }
                        vc.toast("处理成功");
                        $('#shopWithdrawModel').modal('hide');
                        vc.emit('shop', 'shopManage',{});
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            closeShopWithdrawModel:function(){
                $('#shopWithdrawModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
