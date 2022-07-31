/**
    费用折扣 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewPayFeeConfigDiscountInfo:{
                index:0,
                flowComponent:'viewPayFeeConfigDiscountInfo',
                discountId:'',
discountId:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadPayFeeConfigDiscountInfoData();
        },
        _initEvent:function(){
            vc.on('viewPayFeeConfigDiscountInfo','choosePayFeeConfigDiscount',function(_app){
                vc.copyObject(_app, vc.component.viewPayFeeConfigDiscountInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewPayFeeConfigDiscountInfo);
            });

            vc.on('viewPayFeeConfigDiscountInfo', 'onIndex', function(_index){
                vc.component.viewPayFeeConfigDiscountInfo.index = _index;
            });

        },
        methods:{

            _openSelectPayFeeConfigDiscountInfoModel(){
                vc.emit('choosePayFeeConfigDiscount','openChoosePayFeeConfigDiscountModel',{});
            },
            _openAddPayFeeConfigDiscountInfoModel(){
                vc.emit('addPayFeeConfigDiscount','openAddPayFeeConfigDiscountModal',{});
            },
            _loadPayFeeConfigDiscountInfoData:function(){

            }
        }
    });

})(window.vc);
