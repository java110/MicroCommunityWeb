(function(vc,vm){

    vc.extends({
        data:{
            deleteCouponRuleCppsInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteCouponRuleCpps','openDeleteCouponRuleCppsModal',function(_params){

                vc.component.deleteCouponRuleCppsInfo = _params;
                $('#deleteCouponRuleCppsModel').modal('show');

            });
        },
        methods:{
            deleteCouponRuleCpps:function(){
                vc.component.deleteCouponRuleCppsInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'couponRuleCpps.deleteCouponRuleCpps',
                    JSON.stringify(vc.component.deleteCouponRuleCppsInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCouponRuleCppsModel').modal('hide');
                            vc.emit('couponRuleCppsManage','listCouponRuleCpps',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteCouponRuleCppsModel:function(){
                $('#deleteCouponRuleCppsModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
