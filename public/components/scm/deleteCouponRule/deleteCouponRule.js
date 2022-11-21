(function(vc,vm){

    vc.extends({
        data:{
            deleteCouponRuleInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteCouponRule','openDeleteCouponRuleModal',function(_params){

                vc.component.deleteCouponRuleInfo = _params;
                $('#deleteCouponRuleModel').modal('show');

            });
        },
        methods:{
            deleteCouponRule:function(){
                vc.component.deleteCouponRuleInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/couponRule.deleteCouponRule',
                    JSON.stringify(vc.component.deleteCouponRuleInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCouponRuleModel').modal('hide');
                            vc.emit('couponRuleManage','listCouponRule',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteCouponRuleModel:function(){
                $('#deleteCouponRuleModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
