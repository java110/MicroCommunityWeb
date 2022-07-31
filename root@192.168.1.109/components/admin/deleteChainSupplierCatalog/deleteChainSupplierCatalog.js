(function(vc,vm){

    vc.extends({
        data:{
            deleteChainSupplierCatalogInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteChainSupplierCatalog','openDeleteChainSupplierCatalogModal',function(_params){

                vc.component.deleteChainSupplierCatalogInfo = _params;
                $('#deleteChainSupplierCatalogModel').modal('show');

            });
        },
        methods:{
            deleteChainSupplierCatalog:function(){
                vc.component.deleteChainSupplierCatalogInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'chainSupplierCatalog.deleteChainSupplierCatalog',
                    JSON.stringify(vc.component.deleteChainSupplierCatalogInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteChainSupplierCatalogModel').modal('hide');
                            vc.emit('chainSupplierCatalogManage','listChainSupplierCatalog',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteChainSupplierCatalogModel:function(){
                $('#deleteChainSupplierCatalogModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
