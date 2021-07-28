(function(vc,vm){

    vc.extends({
        data:{
            deleteFeeCollectionOrderInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteFeeCollectionOrder','openDeleteFeeCollectionOrderModal',function(_params){

                vc.component.deleteFeeCollectionOrderInfo = _params;
                $('#deleteFeeCollectionOrderModel').modal('show');

            });
        },
        methods:{
            deleteFeeCollectionOrder:function(){
                vc.component.deleteFeeCollectionOrderInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'feeCollectionOrder.deleteFeeCollectionOrder',
                    JSON.stringify(vc.component.deleteFeeCollectionOrderInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeCollectionOrderModel').modal('hide');
                            vc.emit('feeCollectionOrderManage','listFeeCollectionOrder',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteFeeCollectionOrderModel:function(){
                $('#deleteFeeCollectionOrderModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
