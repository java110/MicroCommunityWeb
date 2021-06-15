(function(vc){
    vc.extends({
        propTypes: {
           emitChooseShopRange:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseShopRangeInfo:{
                shopRanges:[],
                _currentShopRangeName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseShopRange','openChooseShopRangeModel',function(_param){
                $('#chooseShopRangeModel').modal('show');
                vc.component._refreshChooseShopRangeInfo();
                vc.component._loadAllShopRangeInfo(1,10,'');
            });
        },
        methods:{
            _loadAllShopRangeInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('shopRange.listShopRanges',
                             param,
                             function(json){
                                var _shopRangeInfo = JSON.parse(json);
                                vc.component.chooseShopRangeInfo.shopRanges = _shopRangeInfo.shopRanges;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseShopRange:function(_shopRange){
                if(_shopRange.hasOwnProperty('name')){
                     _shopRange.shopRangeName = _shopRange.name;
                }
                vc.emit($props.emitChooseShopRange,'chooseShopRange',_shopRange);
                vc.emit($props.emitLoadData,'listShopRangeData',{
                    shopRangeId:_shopRange.shopRangeId
                });
                $('#chooseShopRangeModel').modal('hide');
            },
            queryShopRanges:function(){
                vc.component._loadAllShopRangeInfo(1,10,vc.component.chooseShopRangeInfo._currentShopRangeName);
            },
            _refreshChooseShopRangeInfo:function(){
                vc.component.chooseShopRangeInfo._currentShopRangeName = "";
            }
        }

    });
})(window.vc);
