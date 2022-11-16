(function(vc,vm){

    vc.extends({
        data:{
            deleteSupplierInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteSupplier','openDeleteSupplierModal',function(_params){

                vc.component.deleteSupplierInfo = _params;
                $('#deleteSupplierModel').modal('show');

            });
        },
        methods:{
            deleteSupplier:function(){
                vc.http.apiPost(
                    '/supplier.deleteSupplier',
                    JSON.stringify(vc.component.deleteSupplierInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteSupplierModel').modal('hide');
                            vc.emit('supplierManage','listSupplier',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteSupplierModel:function(){
                $('#deleteSupplierModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
