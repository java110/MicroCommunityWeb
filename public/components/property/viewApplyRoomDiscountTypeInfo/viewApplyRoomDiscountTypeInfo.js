/**
    优惠申请类型 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewApplyRoomDiscountTypeInfo:{
                index:0,
                flowComponent:'viewApplyRoomDiscountTypeInfo',
                typeName:'',
typeDesc:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadApplyRoomDiscountTypeInfoData();
        },
        _initEvent:function(){
            vc.on('viewApplyRoomDiscountTypeInfo','chooseApplyRoomDiscountType',function(_app){
                vc.copyObject(_app, vc.component.viewApplyRoomDiscountTypeInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewApplyRoomDiscountTypeInfo);
            });

            vc.on('viewApplyRoomDiscountTypeInfo', 'onIndex', function(_index){
                vc.component.viewApplyRoomDiscountTypeInfo.index = _index;
            });

        },
        methods:{

            _openSelectApplyRoomDiscountTypeInfoModel(){
                vc.emit('chooseApplyRoomDiscountType','openChooseApplyRoomDiscountTypeModel',{});
            },
            _openAddApplyRoomDiscountTypeInfoModel(){
                vc.emit('addApplyRoomDiscountType','openAddApplyRoomDiscountTypeModal',{});
            },
            _loadApplyRoomDiscountTypeInfoData:function(){

            }
        }
    });

})(window.vc);
