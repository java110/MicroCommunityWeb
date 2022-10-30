(function (vc) {
    vc.extends({
        data: {
            scheduleClassesWeekInfo: {
                scheduleCycle: 1,
                days: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {

            vc.on("scheduleClassesWeekInfo", "notify", function (_param) {
                $that.scheduleClassesWeekInfo.days = _param.days;
                $that.scheduleClassesWeekInfo.scheduleCycle = parseInt(_param.scheduleCycle);

              
            });
        },
        methods: {

        

        }
    });
})(window.vc);