(function(vc,vm){

    vc.extends({
        data:{
            deleteApplyRoomDiscountInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteApplyRoomDiscount','openDeleteApplyRoomDiscountModal',function(_params){

                vc.component.deleteApplyRoomDiscountInfo = _params;
                $('#deleteApplyRoomDiscountModel').modal('show');

            });
        },
        methods:{
            deleteApplyRoomDiscount:function(){
                vc.component.deleteApplyRoomDiscountInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/applyRoomDiscount/deleteApplyRoomDiscount',
                    JSON.stringify(vc.component.deleteApplyRoomDiscountInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteApplyRoomDiscountModel').modal('hide');
                            vc.emit('applyRoomDiscountManage','listApplyRoomDiscount',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteApplyRoomDiscountModel:function(){
                $('#deleteApplyRoomDiscountModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
