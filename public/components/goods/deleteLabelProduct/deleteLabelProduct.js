(function(vc,vm){

    vc.extends({
        data:{
            deleteLabelProductInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteLabelProduct','openDeleteLabelProductModal',function(_params){

                vc.component.deleteLabelProductInfo = _params;
                $('#deleteLabelProductModel').modal('show');

            });
        },
        methods:{
            deleteLabelProduct:function(){
                vc.component.deleteLabelProductInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/product/deleteProductLabel',
                    JSON.stringify(vc.component.deleteLabelProductInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteLabelProductModel').modal('hide');
                            vc.emit('recommendGoodsManage', 'listProduct',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(errInfo);

                     });
            },
            closeDeleteLabelProductModel:function(){
                $('#deleteLabelProductModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
