(function(vc) {
    vc.extends({
        data: {
            staffAttendanceReplenishCheckInInfo: {
                details: [],
                remark:'',
                detailId:'',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('staffAttendanceReplenishCheckIn', 'openModel', function(_param) {
                $('#staffAttendanceReplenishCheckInModel').modal('show');
                $that.staffAttendanceReplenishCheckInInfo.details = _param;
            });
        },
        methods: {
            
        }

    });
})(window.vc);