/**
    车位申请 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewParkingSpaceApplyInfo:{
                index:0,
                flowComponent:'viewParkingSpaceApplyInfo',
                carNum:'',
carBrand:'',
carType:'',
carColor:'',
startTime:'',
endTime:'',
applyPersonName:'',
applyPersonLink:'',
applyPersonId:'',
state:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadParkingSpaceApplyInfoData();
        },
        _initEvent:function(){
            vc.on('viewParkingSpaceApplyInfo','chooseParkingSpaceApply',function(_app){
                vc.copyObject(_app, vc.component.viewParkingSpaceApplyInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewParkingSpaceApplyInfo);
            });

            vc.on('viewParkingSpaceApplyInfo', 'onIndex', function(_index){
                vc.component.viewParkingSpaceApplyInfo.index = _index;
            });

        },
        methods:{

            _openSelectParkingSpaceApplyInfoModel(){
                vc.emit('chooseParkingSpaceApply','openChooseParkingSpaceApplyModel',{});
            },
            _openAddParkingSpaceApplyInfoModel(){
                vc.emit('addParkingSpaceApply','openAddParkingSpaceApplyModal',{});
            },
            _loadParkingSpaceApplyInfoData:function(){

            }
        }
    });

})(window.vc);
