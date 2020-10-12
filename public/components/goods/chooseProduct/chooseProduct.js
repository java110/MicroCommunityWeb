(function(vc){
    vc.extends({
        propTypes: {
           emitChooseProduct:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseProductInfo:{
                products:[],
                _currentProductName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseProduct','openChooseProductModel',function(_param){
                $('#chooseProductModel').modal('show');
                vc.component._refreshChooseProductInfo();
                vc.component._loadAllProductInfo(1,10,'');
            });
        },
        methods:{
            _loadAllProductInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('product.listProducts',
                             param,
                             function(json){
                                var _productInfo = JSON.parse(json);
                                vc.component.chooseProductInfo.products = _productInfo.products;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseProduct:function(_product){
                if(_product.hasOwnProperty('name')){
                     _product.productName = _product.name;
                }
                vc.emit($props.emitChooseProduct,'chooseProduct',_product);
                vc.emit($props.emitLoadData,'listProductData',{
                    productId:_product.productId
                });
                $('#chooseProductModel').modal('hide');
            },
            queryProducts:function(){
                vc.component._loadAllProductInfo(1,10,vc.component.chooseProductInfo._currentProductName);
            },
            _refreshChooseProductInfo:function(){
                vc.component.chooseProductInfo._currentProductName = "";
            }
        }

    });
})(window.vc);
