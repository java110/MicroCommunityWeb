(function(vc,vm){

    vc.extends({
        data:{
            deleteProductCategoryInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteProductCategory','openDeleteProductCategoryModal',function(_params){

                vc.component.deleteProductCategoryInfo = _params;
                $('#deleteProductCategoryModel').modal('show');

            });
        },
        methods:{
            deleteProductCategory:function(){
                vc.component.deleteProductCategoryInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/productCategory/deleteProductCategory',
                    JSON.stringify(vc.component.deleteProductCategoryInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteProductCategoryModel').modal('hide');
                            vc.emit('productCategoryManage','listProductCategory',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteProductCategoryModel:function(){
                $('#deleteProductCategoryModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
