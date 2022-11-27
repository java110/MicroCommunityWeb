(function(vc,vm){

    vc.extends({
        data:{
            deleteCouponPropertyPoolDetailInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteCouponPropertyPoolDetail','openDeleteCouponPropertyPoolModal',function(_params){

                vc.component.deleteCouponPropertyPoolDetailInfo = _params;
                $('#deleteCouponPropertyPoolDetailModel').modal('show');

            });
        },
        methods:{
            deleteCouponPropertyPoolDetail:function(){
                vc.component.deleteCouponPropertyPoolDetailInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/couponProperty.deleteCouponPropertyPoolDetail',
                    JSON.stringify(vc.component.deleteCouponPropertyPoolDetailInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteCouponPropertyPoolDetailModel').modal('hide');
                            vc.emit('couponPropertyPoolDetail', 'listCouponPropertyPool',{});
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
                $('#deleteCouponPropertyPoolDetailModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
