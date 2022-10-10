(function(vc){
    vc.extends({
        propTypes: {
           emitChooseParkingCoupon:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseParkingCouponInfo:{
                parkingCoupons:[],
                _currentParkingCouponName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseParkingCoupon','openChooseParkingCouponModel',function(_param){
                $('#chooseParkingCouponModel').modal('show');
                vc.component._refreshChooseParkingCouponInfo();
                vc.component._loadAllParkingCouponInfo(1,10,'');
            });
        },
        methods:{
            _loadAllParkingCouponInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('parkingCoupon.listParkingCoupons',
                             param,
                             function(json){
                                var _parkingCouponInfo = JSON.parse(json);
                                vc.component.chooseParkingCouponInfo.parkingCoupons = _parkingCouponInfo.parkingCoupons;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseParkingCoupon:function(_parkingCoupon){
                if(_parkingCoupon.hasOwnProperty('name')){
                     _parkingCoupon.parkingCouponName = _parkingCoupon.name;
                }
                vc.emit($props.emitChooseParkingCoupon,'chooseParkingCoupon',_parkingCoupon);
                vc.emit($props.emitLoadData,'listParkingCouponData',{
                    parkingCouponId:_parkingCoupon.parkingCouponId
                });
                $('#chooseParkingCouponModel').modal('hide');
            },
            queryParkingCoupons:function(){
                vc.component._loadAllParkingCouponInfo(1,10,vc.component.chooseParkingCouponInfo._currentParkingCouponName);
            },
            _refreshChooseParkingCouponInfo:function(){
                vc.component.chooseParkingCouponInfo._currentParkingCouponName = "";
            }
        }

    });
})(window.vc);
