(function (vc) {
    vc.extends({
        data: {
            scheduleClassesMonthInfo: {
                scheduleCycle:1,
                days:[]
            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
           
            vc.on("scheduleClassesMonthInfo", "notify", function (_param) {
                $that.scheduleClassesMonthInfo.days = _param.days;
                $that.scheduleClassesMonthInfo.scheduleCycle = _param.scheduleCycle;


             
            });
        },
        methods: {

            
            
        }
    });
})(window.vc);