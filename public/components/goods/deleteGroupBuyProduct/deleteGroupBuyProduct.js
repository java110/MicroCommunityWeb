(function(vc,vm){

    vc.extends({
        data:{
            deleteGroupBuyProductInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteGroupBuyProduct','openDeleteGroupBuyProductModal',function(_params){

                vc.component.deleteGroupBuyProductInfo = _params;
                $('#deleteGroupBuyProductModel').modal('show');

            });
        },
        methods:{
            deleteGroupBuyProduct:function(){
                vc.component.deleteGroupBuyProductInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/groupBuy/deleteGroupBuyProduct',
                    JSON.stringify(vc.component.deleteGroupBuyProductInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteGroupBuyProductModel').modal('hide');
                            vc.emit('groupBuyProductManage', 'listProduct', {});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteGroupBuyProductModel:function(){
                $('#deleteGroupBuyProductModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
