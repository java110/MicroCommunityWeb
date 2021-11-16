(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMainCategoryProduct:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMainCategoryProductInfo:{
                mainCategoryProducts:[],
                _currentMainCategoryProductName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMainCategoryProduct','openChooseMainCategoryProductModel',function(_param){
                $('#chooseMainCategoryProductModel').modal('show');
                vc.component._refreshChooseMainCategoryProductInfo();
                vc.component._loadAllMainCategoryProductInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMainCategoryProductInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('mainCategoryProduct.listMainCategoryProducts',
                             param,
                             function(json){
                                var _mainCategoryProductInfo = JSON.parse(json);
                                vc.component.chooseMainCategoryProductInfo.mainCategoryProducts = _mainCategoryProductInfo.mainCategoryProducts;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMainCategoryProduct:function(_mainCategoryProduct){
                if(_mainCategoryProduct.hasOwnProperty('name')){
                     _mainCategoryProduct.mainCategoryProductName = _mainCategoryProduct.name;
                }
                vc.emit($props.emitChooseMainCategoryProduct,'chooseMainCategoryProduct',_mainCategoryProduct);
                vc.emit($props.emitLoadData,'listMainCategoryProductData',{
                    mainCategoryProductId:_mainCategoryProduct.mainCategoryProductId
                });
                $('#chooseMainCategoryProductModel').modal('hide');
            },
            queryMainCategoryProducts:function(){
                vc.component._loadAllMainCategoryProductInfo(1,10,vc.component.chooseMainCategoryProductInfo._currentMainCategoryProductName);
            },
            _refreshChooseMainCategoryProductInfo:function(){
                vc.component.chooseMainCategoryProductInfo._currentMainCategoryProductName = "";
            }
        }

    });
})(window.vc);
