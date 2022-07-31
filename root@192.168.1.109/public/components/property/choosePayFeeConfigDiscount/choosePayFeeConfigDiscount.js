(function(vc){
    vc.extends({
        propTypes: {
           emitChoosePayFeeConfigDiscount:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            choosePayFeeConfigDiscountInfo:{
                payFeeConfigDiscounts:[],
                _currentPayFeeConfigDiscountName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('choosePayFeeConfigDiscount','openChoosePayFeeConfigDiscountModel',function(_param){
                $('#choosePayFeeConfigDiscountModel').modal('show');
                vc.component._refreshChoosePayFeeConfigDiscountInfo();
                vc.component._loadAllPayFeeConfigDiscountInfo(1,10,'');
            });
        },
        methods:{
            _loadAllPayFeeConfigDiscountInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('payFeeConfigDiscount.listPayFeeConfigDiscounts',
                             param,
                             function(json){
                                var _payFeeConfigDiscountInfo = JSON.parse(json);
                                vc.component.choosePayFeeConfigDiscountInfo.payFeeConfigDiscounts = _payFeeConfigDiscountInfo.payFeeConfigDiscounts;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            choosePayFeeConfigDiscount:function(_payFeeConfigDiscount){
                if(_payFeeConfigDiscount.hasOwnProperty('name')){
                     _payFeeConfigDiscount.payFeeConfigDiscountName = _payFeeConfigDiscount.name;
                }
                vc.emit($props.emitChoosePayFeeConfigDiscount,'choosePayFeeConfigDiscount',_payFeeConfigDiscount);
                vc.emit($props.emitLoadData,'listPayFeeConfigDiscountData',{
                    payFeeConfigDiscountId:_payFeeConfigDiscount.payFeeConfigDiscountId
                });
                $('#choosePayFeeConfigDiscountModel').modal('hide');
            },
            queryPayFeeConfigDiscounts:function(){
                vc.component._loadAllPayFeeConfigDiscountInfo(1,10,vc.component.choosePayFeeConfigDiscountInfo._currentPayFeeConfigDiscountName);
            },
            _refreshChoosePayFeeConfigDiscountInfo:function(){
                vc.component.choosePayFeeConfigDiscountInfo._currentPayFeeConfigDiscountName = "";
            }
        }

    });
})(window.vc);
