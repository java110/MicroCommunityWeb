(function(vc){
    vc.extends({
        propTypes: {
           emitChooseShopType:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseShopTypeInfo:{
                shopTypes:[],
                _currentShopTypeName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseShopType','openChooseShopTypeModel',function(_param){
                $('#chooseShopTypeModel').modal('show');
                vc.component._refreshChooseShopTypeInfo();
                vc.component._loadAllShopTypeInfo(1,10,'');
            });
        },
        methods:{
            _loadAllShopTypeInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('shopType.listShopTypes',
                             param,
                             function(json){
                                var _shopTypeInfo = JSON.parse(json);
                                vc.component.chooseShopTypeInfo.shopTypes = _shopTypeInfo.shopTypes;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseShopType:function(_shopType){
                if(_shopType.hasOwnProperty('name')){
                     _shopType.shopTypeName = _shopType.name;
                }
                vc.emit($props.emitChooseShopType,'chooseShopType',_shopType);
                vc.emit($props.emitLoadData,'listShopTypeData',{
                    shopTypeId:_shopType.shopTypeId
                });
                $('#chooseShopTypeModel').modal('hide');
            },
            queryShopTypes:function(){
                vc.component._loadAllShopTypeInfo(1,10,vc.component.chooseShopTypeInfo._currentShopTypeName);
            },
            _refreshChooseShopTypeInfo:function(){
                vc.component.chooseShopTypeInfo._currentShopTypeName = "";
            }
        }

    });
})(window.vc);
