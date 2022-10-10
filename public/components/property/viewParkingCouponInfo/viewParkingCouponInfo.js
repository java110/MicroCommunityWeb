/**
    停车卷 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewParkingCouponInfo:{
                index:0,
                flowComponent:'viewParkingCouponInfo',
                name:'',
typeCd:'',
paId:'',
value:'',
valuePrice:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadParkingCouponInfoData();
        },
        _initEvent:function(){
            vc.on('viewParkingCouponInfo','chooseParkingCoupon',function(_app){
                vc.copyObject(_app, vc.component.viewParkingCouponInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewParkingCouponInfo);
            });

            vc.on('viewParkingCouponInfo', 'onIndex', function(_index){
                vc.component.viewParkingCouponInfo.index = _index;
            });

        },
        methods:{

            _openSelectParkingCouponInfoModel(){
                vc.emit('chooseParkingCoupon','openChooseParkingCouponModel',{});
            },
            _openAddParkingCouponInfoModel(){
                vc.emit('addParkingCoupon','openAddParkingCouponModal',{});
            },
            _loadParkingCouponInfoData:function(){

            }
        }
    });

})(window.vc);
