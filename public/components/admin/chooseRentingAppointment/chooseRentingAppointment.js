(function(vc){
    vc.extends({
        propTypes: {
           emitChooseRentingAppointment:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseRentingAppointmentInfo:{
                rentingAppointments:[],
                _currentRentingAppointmentName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseRentingAppointment','openChooseRentingAppointmentModel',function(_param){
                $('#chooseRentingAppointmentModel').modal('show');
                vc.component._refreshChooseRentingAppointmentInfo();
                vc.component._loadAllRentingAppointmentInfo(1,10,'');
            });
        },
        methods:{
            _loadAllRentingAppointmentInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('rentingAppointment.listRentingAppointments',
                             param,
                             function(json){
                                var _rentingAppointmentInfo = JSON.parse(json);
                                vc.component.chooseRentingAppointmentInfo.rentingAppointments = _rentingAppointmentInfo.rentingAppointments;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseRentingAppointment:function(_rentingAppointment){
                if(_rentingAppointment.hasOwnProperty('name')){
                     _rentingAppointment.rentingAppointmentName = _rentingAppointment.name;
                }
                vc.emit($props.emitChooseRentingAppointment,'chooseRentingAppointment',_rentingAppointment);
                vc.emit($props.emitLoadData,'listRentingAppointmentData',{
                    rentingAppointmentId:_rentingAppointment.rentingAppointmentId
                });
                $('#chooseRentingAppointmentModel').modal('hide');
            },
            queryRentingAppointments:function(){
                vc.component._loadAllRentingAppointmentInfo(1,10,vc.component.chooseRentingAppointmentInfo._currentRentingAppointmentName);
            },
            _refreshChooseRentingAppointmentInfo:function(){
                vc.component.chooseRentingAppointmentInfo._currentRentingAppointmentName = "";
            }
        }

    });
})(window.vc);
