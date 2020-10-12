(function(vc){
    vc.extends({
        propTypes: {
           emitChooseProductCategory:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseProductCategoryInfo:{
                productCategorys:[],
                _currentProductCategoryName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseProductCategory','openChooseProductCategoryModel',function(_param){
                $('#chooseProductCategoryModel').modal('show');
                vc.component._refreshChooseProductCategoryInfo();
                vc.component._loadAllProductCategoryInfo(1,10,'');
            });
        },
        methods:{
            _loadAllProductCategoryInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('productCategory.listProductCategorys',
                             param,
                             function(json){
                                var _productCategoryInfo = JSON.parse(json);
                                vc.component.chooseProductCategoryInfo.productCategorys = _productCategoryInfo.productCategorys;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseProductCategory:function(_productCategory){
                if(_productCategory.hasOwnProperty('name')){
                     _productCategory.productCategoryName = _productCategory.name;
                }
                vc.emit($props.emitChooseProductCategory,'chooseProductCategory',_productCategory);
                vc.emit($props.emitLoadData,'listProductCategoryData',{
                    productCategoryId:_productCategory.productCategoryId
                });
                $('#chooseProductCategoryModel').modal('hide');
            },
            queryProductCategorys:function(){
                vc.component._loadAllProductCategoryInfo(1,10,vc.component.chooseProductCategoryInfo._currentProductCategoryName);
            },
            _refreshChooseProductCategoryInfo:function(){
                vc.component.chooseProductCategoryInfo._currentProductCategoryName = "";
            }
        }

    });
})(window.vc);
