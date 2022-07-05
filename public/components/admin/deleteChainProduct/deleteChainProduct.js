(function(vc,vm){

    vc.extends({
        data:{
            deleteChainProductInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteChainProduct','openDeleteChainProductModal',function(_params){

                vc.component.deleteChainProductInfo = _params;
                $('#deleteChainProductModel').modal('show');

            });
        },
        methods:{
            deleteChainProduct:function(){
                vc.component.deleteChainProductInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'chainProduct.deleteChainProduct',
                    JSON.stringify(vc.component.deleteChainProductInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteChainProductModel').modal('hide');

                            
                            vc.emit('chainProductManage','listChainProduct',{});


                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteChainProductModel:function(){
                $('#deleteChainProductModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
