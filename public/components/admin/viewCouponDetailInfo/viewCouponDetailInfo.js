/**
    商家购买记录表 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewCouponDetailInfo:{
                index:0,
                flowComponent:'viewCouponDetailInfo',
                detailId:'',
poolId:'',
shopId:'',
couponName:'',
actualPrice:'',
buyPrice:'',
amount:'',
buyCount:'',
validityDay:'',
primary:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadCouponDetailInfoData();
        },
        _initEvent:function(){
            vc.on('viewCouponDetailInfo','chooseCouponDetail',function(_app){
                vc.copyObject(_app, vc.component.viewCouponDetailInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewCouponDetailInfo);
            });

            vc.on('viewCouponDetailInfo', 'onIndex', function(_index){
                vc.component.viewCouponDetailInfo.index = _index;
            });

        },
        methods:{

            _openSelectCouponDetailInfoModel(){
                vc.emit('chooseCouponDetail','openChooseCouponDetailModel',{});
            },
            _openAddCouponDetailInfoModel(){
                vc.emit('addCouponDetail','openAddCouponDetailModal',{});
            },
            _loadCouponDetailInfoData:function(){

            }
        }
    });

})(window.vc);
