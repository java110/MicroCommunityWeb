(function(vc){
    vc.extends({
        propTypes: {
           emitChooseCouponDetail:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseCouponDetailInfo:{
                couponDetails:[],
                _currentCouponDetailName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseCouponDetail','openChooseCouponDetailModel',function(_param){
                $('#chooseCouponDetailModel').modal('show');
                vc.component._refreshChooseCouponDetailInfo();
                vc.component._loadAllCouponDetailInfo(1,10,'');
            });
        },
        methods:{
            _loadAllCouponDetailInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('couponDetail.listCouponDetails',
                             param,
                             function(json){
                                var _couponDetailInfo = JSON.parse(json);
                                vc.component.chooseCouponDetailInfo.couponDetails = _couponDetailInfo.couponDetails;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseCouponDetail:function(_couponDetail){
                if(_couponDetail.hasOwnProperty('name')){
                     _couponDetail.couponDetailName = _couponDetail.name;
                }
                vc.emit($props.emitChooseCouponDetail,'chooseCouponDetail',_couponDetail);
                vc.emit($props.emitLoadData,'listCouponDetailData',{
                    couponDetailId:_couponDetail.couponDetailId
                });
                $('#chooseCouponDetailModel').modal('hide');
            },
            queryCouponDetails:function(){
                vc.component._loadAllCouponDetailInfo(1,10,vc.component.chooseCouponDetailInfo._currentCouponDetailName);
            },
            _refreshChooseCouponDetailInfo:function(){
                vc.component.chooseCouponDetailInfo._currentCouponDetailName = "";
            }
        }

    });
})(window.vc);
