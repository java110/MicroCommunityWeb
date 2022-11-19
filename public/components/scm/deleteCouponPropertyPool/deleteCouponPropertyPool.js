(function(vc,vm){

    vc.extends({
        data:{
            deleteCouponPropertyPoolInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteCouponPropertyPool','openDeleteCouponPropertyPoolModal',function(_params){

                vc.component.deleteCouponPropertyPoolInfo = _params;
                $('#deleteCouponPropertyPoolModel').modal('show');

            });
        },
        methods:{
            deleteCouponPropertyPool:function(){
                vc.component.deleteCouponPropertyPoolInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/couponProperty.deleteCouponPropertyPool',
                    JSON.stringify(vc.component.deleteCouponPropertyPoolInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCouponPropertyPoolModel').modal('hide');
                            vc.emit('couponPropertyPoolManage','listCouponPropertyPool',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteCouponPropertyPoolModel:function(){
                $('#deleteCouponPropertyPoolModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
