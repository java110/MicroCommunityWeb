(function(vc){
    vc.extends({
        propTypes: {
           emitChooseApplyRoomDiscountType:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseApplyRoomDiscountTypeInfo:{
                applyRoomDiscountTypes:[],
                _currentApplyRoomDiscountTypeName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseApplyRoomDiscountType','openChooseApplyRoomDiscountTypeModel',function(_param){
                $('#chooseApplyRoomDiscountTypeModel').modal('show');
                vc.component._refreshChooseApplyRoomDiscountTypeInfo();
                vc.component._loadAllApplyRoomDiscountTypeInfo(1,10,'');
            });
        },
        methods:{
            _loadAllApplyRoomDiscountTypeInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('applyRoomDiscountType.listApplyRoomDiscountTypes',
                             param,
                             function(json){
                                var _applyRoomDiscountTypeInfo = JSON.parse(json);
                                vc.component.chooseApplyRoomDiscountTypeInfo.applyRoomDiscountTypes = _applyRoomDiscountTypeInfo.applyRoomDiscountTypes;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseApplyRoomDiscountType:function(_applyRoomDiscountType){
                if(_applyRoomDiscountType.hasOwnProperty('name')){
                     _applyRoomDiscountType.applyRoomDiscountTypeName = _applyRoomDiscountType.name;
                }
                vc.emit($props.emitChooseApplyRoomDiscountType,'chooseApplyRoomDiscountType',_applyRoomDiscountType);
                vc.emit($props.emitLoadData,'listApplyRoomDiscountTypeData',{
                    applyRoomDiscountTypeId:_applyRoomDiscountType.applyRoomDiscountTypeId
                });
                $('#chooseApplyRoomDiscountTypeModel').modal('hide');
            },
            queryApplyRoomDiscountTypes:function(){
                vc.component._loadAllApplyRoomDiscountTypeInfo(1,10,vc.component.chooseApplyRoomDiscountTypeInfo._currentApplyRoomDiscountTypeName);
            },
            _refreshChooseApplyRoomDiscountTypeInfo:function(){
                vc.component.chooseApplyRoomDiscountTypeInfo._currentApplyRoomDiscountTypeName = "";
            }
        }

    });
})(window.vc);
