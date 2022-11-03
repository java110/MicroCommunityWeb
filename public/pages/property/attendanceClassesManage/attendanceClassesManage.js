/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            attendanceClassesManageInfo: {
                attendanceClassess: [],
                classesObjId: '',
                classesObjName: '',
            }
        },
        _initMethod: function() {
        },
        _initEvent: function() {
            vc.on('attendanceClassesManage', 'listAttendanceClasses', function(_param) {
                vc.component._listAttendanceClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            });

            vc.on('selectStaff', 'switchOrg', function (_param) {
                $that.attendanceClassesManageInfo.classesObjId = _param.orgId;
                $that.attendanceClassesManageInfo.classesObjName = _param.orgName;
                $that._listAttendanceClassess();
            })
        },
        methods: {
            _listAttendanceClassess: function(_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:1,
                        classesObjId:$that.attendanceClassesManageInfo.classesObjId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/attendanceClasses.listAttendanceClassess',
                    param,
                    function(json, res) {
                        let _attendanceClassesManageInfo = JSON.parse(json);
                        $that.attendanceClassesManageInfo.attendanceClassess = _attendanceClassesManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAttendanceClassesModal: function() {
                vc.emit('addAttendanceClasses', 'openAddAttendanceClassesModal', {
                    classesObjId:$that.attendanceClassesManageInfo.classesObjId,
                    classesObjName:$that.attendanceClassesManageInfo.classesObjName
                });
                //vc.jumpToPage('/#/pages/property/addAttendanceClasses?classesObjId=')
            },
            _openEditAttendanceClassesModel: function(_attendanceClasses) {
                vc.emit('editAttendanceClasses', 'openEditAttendanceClassesModal', _attendanceClasses);
            },
            _openDeleteAttendanceClassesModel: function(_attendanceClasses) {
                vc.emit('deleteAttendanceClasses', 'openDeleteAttendanceClassesModal', _attendanceClasses);
            },
            //查询
            _queryAttendanceClassesMethod: function() {
                vc.component._listAttendanceClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAttendanceClassesMethod: function() {
                vc.component.attendanceClassesManageInfo.conditions.classesId = "";
                vc.component.attendanceClassesManageInfo.conditions.classesName = "";
                vc.component.attendanceClassesManageInfo.conditions.clockType = "";
                vc.component._listAttendanceClassess(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.attendanceClassesManageInfo.moreCondition) {
                    vc.component.attendanceClassesManageInfo.moreCondition = false;
                } else {
                    vc.component.attendanceClassesManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);