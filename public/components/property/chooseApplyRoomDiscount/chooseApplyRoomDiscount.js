(function(vc){
    vc.extends({
        propTypes: {
           emitChooseApplyRoomDiscount:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseApplyRoomDiscountInfo:{
                applyRoomDiscounts:[],
                _currentApplyRoomDiscountName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseApplyRoomDiscount','openChooseApplyRoomDiscountModel',function(_param){
                $('#chooseApplyRoomDiscountModel').modal('show');
                vc.component._refreshChooseApplyRoomDiscountInfo();
                vc.component._loadAllApplyRoomDiscountInfo(1,10,'');
            });
        },
        methods:{
            _loadAllApplyRoomDiscountInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('applyRoomDiscount.listApplyRoomDiscounts',
                             param,
                             function(json){
                                var _applyRoomDiscountInfo = JSON.parse(json);
                                vc.component.chooseApplyRoomDiscountInfo.applyRoomDiscounts = _applyRoomDiscountInfo.applyRoomDiscounts;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseApplyRoomDiscount:function(_applyRoomDiscount){
                if(_applyRoomDiscount.hasOwnProperty('name')){
                     _applyRoomDiscount.applyRoomDiscountName = _applyRoomDiscount.name;
                }
                vc.emit($props.emitChooseApplyRoomDiscount,'chooseApplyRoomDiscount',_applyRoomDiscount);
                vc.emit($props.emitLoadData,'listApplyRoomDiscountData',{
                    applyRoomDiscountId:_applyRoomDiscount.applyRoomDiscountId
                });
                $('#chooseApplyRoomDiscountModel').modal('hide');
            },
            queryApplyRoomDiscounts:function(){
                vc.component._loadAllApplyRoomDiscountInfo(1,10,vc.component.chooseApplyRoomDiscountInfo._currentApplyRoomDiscountName);
            },
            _refreshChooseApplyRoomDiscountInfo:function(){
                vc.component.chooseApplyRoomDiscountInfo._currentApplyRoomDiscountName = "";
            }
        }

    });
})(window.vc);
