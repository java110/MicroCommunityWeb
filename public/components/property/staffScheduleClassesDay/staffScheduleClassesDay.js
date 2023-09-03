(function (vc) {
    vc.extends({
        data: {
            scheduleClassesDayInfo: {
                scheduleCycle:1,
                days:[]
            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
           
            vc.on("scheduleClassesDayInfo", "notify", function (_param) {
                $that.scheduleClassesDayInfo.days = _param.days;
                $that.scheduleClassesDayInfo.scheduleCycle = _param.scheduleCycle;

            });
        },
        methods: {
            
        }
    });
})(window.vc);