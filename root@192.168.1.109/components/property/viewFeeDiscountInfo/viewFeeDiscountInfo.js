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
            viewFeeDiscountInfo:{
                index:0,
                flowComponent:'viewFeeDiscountInfo',
                discountName:'',
discountType:'',
ruleId:'',
discountDesc:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadFeeDiscountInfoData();
        },
        _initEvent:function(){
            vc.on('viewFeeDiscountInfo','chooseFeeDiscount',function(_app){
                vc.copyObject(_app, vc.component.viewFeeDiscountInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewFeeDiscountInfo);
            });

            vc.on('viewFeeDiscountInfo', 'onIndex', function(_index){
                vc.component.viewFeeDiscountInfo.index = _index;
            });

        },
        methods:{

            _openSelectFeeDiscountInfoModel(){
                vc.emit('chooseFeeDiscount','openChooseFeeDiscountModel',{});
            },
            _openAddFeeDiscountInfoModel(){
                vc.emit('addFeeDiscount','openAddFeeDiscountModal',{});
            },
            _loadFeeDiscountInfoData:function(){

            }
        }
    });

})(window.vc);
