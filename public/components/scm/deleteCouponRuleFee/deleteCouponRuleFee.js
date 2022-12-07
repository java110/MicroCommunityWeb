(function(vc,vm){

    vc.extends({
        data:{
            deleteCouponRuleFeeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteCouponRuleFee','openDeleteCouponRuleFeeModal',function(_params){

                vc.component.deleteCouponRuleFeeInfo = _params;
                $('#deleteCouponRuleFeeModel').modal('show');

            });
        },
        methods:{
            deleteCouponRuleFee:function(){
                vc.component.deleteCouponRuleFeeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/couponRule.deleteCouponRuleFee',
                    JSON.stringify(vc.component.deleteCouponRuleFeeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCouponRuleFeeModel').modal('hide');
                            vc.emit('couponRuleFeeManage','listCouponRuleFee',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteCouponRuleFeeModel:function(){
                $('#deleteCouponRuleFeeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
