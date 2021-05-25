(function(vc,vm){

    vc.extends({
        data:{
            deleteFeeManualCollectionInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteFeeManualCollection','openDeleteFeeManualCollectionModal',function(_params){

                vc.component.deleteFeeManualCollectionInfo = _params;
                $('#deleteFeeManualCollectionModel').modal('show');

            });
        },
        methods:{
            deleteFeeManualCollection:function(){
                vc.component.deleteFeeManualCollectionInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/feeManualCollection/deleteFeeManualCollection',
                    JSON.stringify(vc.component.deleteFeeManualCollectionInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeeManualCollectionModel').modal('hide');
                            vc.emit('feeManualCollectionManage','listFeeManualCollection',{});
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
                $('#deleteFeeManualCollectionModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
