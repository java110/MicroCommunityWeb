(function(vc,vm){

    vc.extends({
        data:{
            deleteApplyRoomDiscountTypeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteApplyRoomDiscountType','openDeleteApplyRoomDiscountTypeModal',function(_params){

                vc.component.deleteApplyRoomDiscountTypeInfo = _params;
                $('#deleteApplyRoomDiscountTypeModel').modal('show');

            });
        },
        methods:{
            deleteApplyRoomDiscountType:function(){
                vc.component.deleteApplyRoomDiscountTypeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/applyRoomDiscount/deleteApplyRoomDiscountType',
                    JSON.stringify(vc.component.deleteApplyRoomDiscountTypeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteApplyRoomDiscountTypeModel').modal('hide');
                            vc.emit('applyRoomDiscountTypeManage','listApplyRoomDiscountType',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteApplyRoomDiscountTypeModel:function(){
                $('#deleteApplyRoomDiscountTypeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
