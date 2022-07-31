(function(vc){
    vc.extends({
        propTypes: {
           emitChooseFeeDiscount:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseFeeDiscountInfo:{
                feeDiscounts:[],
                _currentFeeDiscountName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseFeeDiscount','openChooseFeeDiscountModel',function(_param){
                $('#chooseFeeDiscountModel').modal('show');
                vc.component._refreshChooseFeeDiscountInfo();
                vc.component._loadAllFeeDiscountInfo(1,10,'');
            });
        },
        methods:{
            _loadAllFeeDiscountInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('feeDiscount.listFeeDiscounts',
                             param,
                             function(json){
                                var _feeDiscountInfo = JSON.parse(json);
                                vc.component.chooseFeeDiscountInfo.feeDiscounts = _feeDiscountInfo.feeDiscounts;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseFeeDiscount:function(_feeDiscount){
                if(_feeDiscount.hasOwnProperty('name')){
                     _feeDiscount.feeDiscountName = _feeDiscount.name;
                }
                vc.emit($props.emitChooseFeeDiscount,'chooseFeeDiscount',_feeDiscount);
                vc.emit($props.emitLoadData,'listFeeDiscountData',{
                    feeDiscountId:_feeDiscount.feeDiscountId
                });
                $('#chooseFeeDiscountModel').modal('hide');
            },
            queryFeeDiscounts:function(){
                vc.component._loadAllFeeDiscountInfo(1,10,vc.component.chooseFeeDiscountInfo._currentFeeDiscountName);
            },
            _refreshChooseFeeDiscountInfo:function(){
                vc.component.chooseFeeDiscountInfo._currentFeeDiscountName = "";
            }
        }

    });
})(window.vc);
