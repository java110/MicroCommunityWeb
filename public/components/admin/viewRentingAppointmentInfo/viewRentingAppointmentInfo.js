/**
    租赁预约 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewRentingAppointmentInfo:{
                index:0,
                flowComponent:'viewRentingAppointmentInfo',
                tenantName:'',
tenantSex:'',
tenantTel:'',
appointmentTime:'',
appointmentRoomId:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadRentingAppointmentInfoData();
        },
        _initEvent:function(){
            vc.on('viewRentingAppointmentInfo','chooseRentingAppointment',function(_app){
                vc.copyObject(_app, vc.component.viewRentingAppointmentInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewRentingAppointmentInfo);
            });

            vc.on('viewRentingAppointmentInfo', 'onIndex', function(_index){
                vc.component.viewRentingAppointmentInfo.index = _index;
            });

        },
        methods:{

            _openSelectRentingAppointmentInfoModel(){
                vc.emit('chooseRentingAppointment','openChooseRentingAppointmentModel',{});
            },
            _openAddRentingAppointmentInfoModel(){
                vc.emit('addRentingAppointment','openAddRentingAppointmentModal',{});
            },
            _loadRentingAppointmentInfoData:function(){

            }
        }
    });

})(window.vc);
