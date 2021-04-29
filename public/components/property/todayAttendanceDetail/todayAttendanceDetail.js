(function (vc) {
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            todayAttendanceDetailInfo: {
                attendanceClassesTaskDetails: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('todayAttendanceDetail', 'openTodayAttendanceDetail', function (_param) {
                $that._refreshTodayAttendanceDetailInfo();
                $('#todayAttendanceDetailModel').modal('show');
                $that.todayAttendanceDetailInfo.attendanceClassesTaskDetails = _param.attendanceClassesTaskDetails;
            });
        },
        methods: {
            _refreshTodayAttendanceDetailInfo: function () {
                $that.todayAttendanceDetailInfo = {
                    attendanceClassesTaskDetails: []
                };
            },
            openFile: function (_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            }
        }

    });
})(window.vc);
