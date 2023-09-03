(function(vc,vm){

    vc.extends({
        data:{
            deleteMarketGoodsInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteMarketGoods','openDeleteMarketGoodsModal',function(_params){

                vc.component.deleteMarketGoodsInfo = _params;
                $('#deleteMarketGoodsModel').modal('show');

            });
        },
        methods:{
            deleteMarketGoods:function(){
                vc.http.apiPost(
                    '/marketGoods.deleteMarketGoods',
                    JSON.stringify(vc.component.deleteMarketGoodsInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketGoodsModel').modal('hide');
                            vc.emit('marketGoodsManage','listMarketGoods',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteMarketGoodsModel:function(){
                $('#deleteMarketGoodsModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
