(function(vc,vm){

    vc.extends({
        data:{
            deleteChainSupplierInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteChainSupplier','openDeleteChainSupplierModal',function(_params){

                vc.component.deleteChainSupplierInfo = _params;
                $('#deleteChainSupplierModel').modal('show');

            });
        },
        methods:{
            deleteChainSupplier:function(){
                vc.component.deleteChainSupplierInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'chainSupplier.deleteChainSupplier',
                    JSON.stringify(vc.component.deleteChainSupplierInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteChainSupplierModel').modal('hide');
                            vc.emit('chainSupplierManage','listChainSupplier',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteChainSupplierModel:function(){
                $('#deleteChainSupplierModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
