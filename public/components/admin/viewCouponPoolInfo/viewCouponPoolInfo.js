/**
    优惠券池 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewCouponPoolInfo:{
                index:0,
                flowComponent:'viewCouponPoolInfo',
                poolId:'',
couponType:'',
couponName:'',
actualPrice:'',
buyPrice:'',
couponStock:'',
validityDay:'',
seq:'',
state:'',
primary:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadCouponPoolInfoData();
        },
        _initEvent:function(){
            vc.on('viewCouponPoolInfo','chooseCouponPool',function(_app){
                vc.copyObject(_app, vc.component.viewCouponPoolInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewCouponPoolInfo);
            });

            vc.on('viewCouponPoolInfo', 'onIndex', function(_index){
                vc.component.viewCouponPoolInfo.index = _index;
            });

        },
        methods:{

            _openSelectCouponPoolInfoModel(){
                vc.emit('chooseCouponPool','openChooseCouponPoolModel',{});
            },
            _openAddCouponPoolInfoModel(){
                vc.emit('addCouponPool','openAddCouponPoolModal',{});
            },
            _loadCouponPoolInfoData:function(){

            }
        }
    });

})(window.vc);
