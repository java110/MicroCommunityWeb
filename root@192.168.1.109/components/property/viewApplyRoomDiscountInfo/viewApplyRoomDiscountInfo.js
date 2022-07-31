/**
    房屋折扣申请 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewApplyRoomDiscountInfo:{
                index:0,
                flowComponent:'viewApplyRoomDiscountInfo',
                roomName:'',
discountId:'',
applyType:'',
createUserName:'',
createUserTel:'',
startTime:'',
endTime:'',
createRemark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadApplyRoomDiscountInfoData();
        },
        _initEvent:function(){
            vc.on('viewApplyRoomDiscountInfo','chooseApplyRoomDiscount',function(_app){
                vc.copyObject(_app, vc.component.viewApplyRoomDiscountInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewApplyRoomDiscountInfo);
            });

            vc.on('viewApplyRoomDiscountInfo', 'onIndex', function(_index){
                vc.component.viewApplyRoomDiscountInfo.index = _index;
            });

        },
        methods:{

            _openSelectApplyRoomDiscountInfoModel(){
                vc.emit('chooseApplyRoomDiscount','openChooseApplyRoomDiscountModel',{});
            },
            _openAddApplyRoomDiscountInfoModel(){
                vc.emit('addApplyRoomDiscount','openAddApplyRoomDiscountModal',{});
            },
            _loadApplyRoomDiscountInfoData:function(){

            }
        }
    });

})(window.vc);
