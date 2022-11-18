(function(vc,vm){

    vc.extends({
        data:{
            deleteSupplierCouponInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteSupplierCoupon','openDeleteSupplierCouponModal',function(_params){

                vc.component.deleteSupplierCouponInfo = _params;
                $('#deleteSupplierCouponModel').modal('show');

            });
        },
        methods:{
            deleteSupplierCoupon:function(){
                vc.http.apiPost(
                    '/supplierCoupon.deleteSupplierCoupon',
                    JSON.stringify(vc.component.deleteSupplierCouponInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteSupplierCouponModel').modal('hide');
                            vc.emit('supplierCoupon','listSupplierCoupon',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteSupplierCouponModel:function(){
                $('#deleteSupplierCouponModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
