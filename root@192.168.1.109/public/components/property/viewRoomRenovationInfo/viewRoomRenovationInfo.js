/**
    房屋装修 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewRoomRenovationInfo:{
                index:0,
                flowComponent:'viewRoomRenovationInfo',
                roomName:'',
personName:'',
personTel:'',
startTime:'',
endTime:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadRoomRenovationInfoData();
        },
        _initEvent:function(){
            vc.on('viewRoomRenovationInfo','chooseRoomRenovation',function(_app){
                vc.copyObject(_app, vc.component.viewRoomRenovationInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewRoomRenovationInfo);
            });

            vc.on('viewRoomRenovationInfo', 'onIndex', function(_index){
                vc.component.viewRoomRenovationInfo.index = _index;
            });

        },
        methods:{

            _openSelectRoomRenovationInfoModel(){
                vc.emit('chooseRoomRenovation','openChooseRoomRenovationModel',{});
            },
            _openAddRoomRenovationInfoModel(){
                vc.emit('addRoomRenovation','openAddRoomRenovationModal',{});
            },
            _loadRoomRenovationInfoData:function(){

            }
        }
    });

})(window.vc);
