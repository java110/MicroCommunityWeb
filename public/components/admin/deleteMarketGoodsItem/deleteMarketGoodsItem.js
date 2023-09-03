(function(vc,vm){

    vc.extends({
        data:{
            deleteMarketGoodsItemInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMarketGoodsItem','openDeleteMarketGoodsItemModal',function(_params){

                vc.component.deleteMarketGoodsItemInfo = _params;
                $('#deleteMarketGoodsItemModel').modal('show');

            });
        },
        methods:{
            deleteMarketGoodsItem:function(){
                vc.http.apiPost(
                    '/marketGoods.deleteMarketGoodsItem',
                    JSON.stringify(vc.component.deleteMarketGoodsItemInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketGoodsItemModel').modal('hide');
                            vc.emit('marketGoodsItemManage','listMarketGoodsItem',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMarketGoodsItemModel:function(){
                $('#deleteMarketGoodsItemModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
