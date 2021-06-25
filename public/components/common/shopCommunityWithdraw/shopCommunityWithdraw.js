(function(vc,vm){

    vc.extends({
        data:{
            shopCommunityWithdrawInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('shopCommunityWithdraw','shopCommunityWithdrawModel',function(_params){
                vc.component.shopCommunityWithdrawInfo = _params;
                $('#shopCommunityWithdrawModel').modal('show');

            });
        },
        methods:{
             //提交撤回信息
            updateShopCommunityWithdraw:function(){
                vc.component.shopCommunityWithdrawInfo.state = '12001';
                console.log(vc.component.shopCommunityWithdrawInfo);
                //发送get请求
                vc.http.apiPost('/shop/auditShopCommunity',
                    JSON.stringify(vc.component.shopCommunityWithdrawInfo),
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
                        $('#shopCommunityWithdrawModel').modal('hide');
                        vc.emit('auditShopCommunity', 'listAuditShopCommunitys',{});
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            closeShopCommunityWithdrawModel:function(){
                $('#shopCommunityWithdrawModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
