(function(vc){
    vc.extends({
        propTypes: {
           emitChooseAttendanceClasses:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseAttendanceClassesInfo:{
                attendanceClassess:[],
                _currentAttendanceClassesName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseAttendanceClasses','openChooseAttendanceClassesModel',function(_param){
                $('#chooseAttendanceClassesModel').modal('show');
                vc.component._refreshChooseAttendanceClassesInfo();
                vc.component._loadAllAttendanceClassesInfo(1,10,'');
            });
        },
        methods:{
            _loadAllAttendanceClassesInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('attendanceClasses.listAttendanceClassess',
                             param,
                             function(json){
                                var _attendanceClassesInfo = JSON.parse(json);
                                vc.component.chooseAttendanceClassesInfo.attendanceClassess = _attendanceClassesInfo.attendanceClassess;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseAttendanceClasses:function(_attendanceClasses){
                if(_attendanceClasses.hasOwnProperty('name')){
                     _attendanceClasses.attendanceClassesName = _attendanceClasses.name;
                }
                vc.emit($props.emitChooseAttendanceClasses,'chooseAttendanceClasses',_attendanceClasses);
                vc.emit($props.emitLoadData,'listAttendanceClassesData',{
                    attendanceClassesId:_attendanceClasses.attendanceClassesId
                });
                $('#chooseAttendanceClassesModel').modal('hide');
            },
            queryAttendanceClassess:function(){
                vc.component._loadAllAttendanceClassesInfo(1,10,vc.component.chooseAttendanceClassesInfo._currentAttendanceClassesName);
            },
            _refreshChooseAttendanceClassesInfo:function(){
                vc.component.chooseAttendanceClassesInfo._currentAttendanceClassesName = "";
            }
        }

    });
})(window.vc);
