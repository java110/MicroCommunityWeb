(function(vc,vm){

    vc.extends({
        data:{
            deleteSupplierTypeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteSupplierType','openDeleteSupplierTypeModal',function(_params){

                vc.component.deleteSupplierTypeInfo = _params;
                $('#deleteSupplierTypeModel').modal('show');

            });
        },
        methods:{
            deleteSupplierType:function(){
                vc.http.apiPost(
                    '/supplierType.deleteSupplierType',
                    JSON.stringify(vc.component.deleteSupplierTypeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteSupplierTypeModel').modal('hide');
                            vc.emit('supplierTypeManage','listSupplierType',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteSupplierTypeModel:function(){
                $('#deleteSupplierTypeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
