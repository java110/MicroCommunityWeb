(function(vc,vm){

    vc.extends({
        data:{
            deleteProductInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteProduct','openDeleteProductModal',function(_params){
                console.log(_params);
                vc.component.deleteProductInfo = _params;
                $('#deleteProductModel').modal('show');

            });
        },
        methods:{
            deleteProduct:function(){
                vc.http.apiPost(
                    '/product/deleteProduct',
                    JSON.stringify(vc.component.deleteProductInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteProductModel').modal('hide');
                            vc.emit('productManage','listProduct',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteProductModel:function(){
                $('#deleteProductModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
