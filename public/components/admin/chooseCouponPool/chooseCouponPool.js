(function(vc){
    vc.extends({
        propTypes: {
           emitChooseCouponPool:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseCouponPoolInfo:{
                couponPools:[],
                _currentCouponPoolName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseCouponPool','openChooseCouponPoolModel',function(_param){
                $('#chooseCouponPoolModel').modal('show');
                vc.component._refreshChooseCouponPoolInfo();
                vc.component._loadAllCouponPoolInfo(1,10,'');
            });
        },
        methods:{
            _loadAllCouponPoolInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('couponPool.listCouponPools',
                             param,
                             function(json){
                                var _couponPoolInfo = JSON.parse(json);
                                vc.component.chooseCouponPoolInfo.couponPools = _couponPoolInfo.couponPools;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseCouponPool:function(_couponPool){
                if(_couponPool.hasOwnProperty('name')){
                     _couponPool.couponPoolName = _couponPool.name;
                }
                vc.emit($props.emitChooseCouponPool,'chooseCouponPool',_couponPool);
                vc.emit($props.emitLoadData,'listCouponPoolData',{
                    couponPoolId:_couponPool.couponPoolId
                });
                $('#chooseCouponPoolModel').modal('hide');
            },
            queryCouponPools:function(){
                vc.component._loadAllCouponPoolInfo(1,10,vc.component.chooseCouponPoolInfo._currentCouponPoolName);
            },
            _refreshChooseCouponPoolInfo:function(){
                vc.component.chooseCouponPoolInfo._currentCouponPoolName = "";
            }
        }

    });
})(window.vc);
