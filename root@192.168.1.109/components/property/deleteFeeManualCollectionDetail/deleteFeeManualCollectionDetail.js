(function(vc,vm){

    vc.extends({
        data:{
            deleteFeeManualCollectionDetailInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteFeeManualCollectionDetail','openDeleteFeeManualCollectionModal',function(_params){

                vc.component.deleteFeeManualCollectionDetailInfo = _params;
                $('#deleteFeeManualCollectionDetailModel').modal('show');

            });
        },
        methods:{
            deleteFeeManualCollectionDetail:function(){
                vc.component.deleteFeeManualCollectionDetailInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/feeManualCollection/deleteCollectionDetail',
                    JSON.stringify(vc.component.deleteFeeManualCollectionDetailInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeManualCollectionDetailModel').modal('hide');
                            vc.emit('feeManualCollectionDetailManage', 'listFeeManualCollectionDetail',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteFeeManualCollectionModel:function(){
                $('#deleteFeeManualCollectionDetailModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
