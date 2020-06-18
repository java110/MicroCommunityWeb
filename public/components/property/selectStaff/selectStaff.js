(function (vc) {

    vc.extends({
        data: {
            selectStaffInfo: {
                flowId: '',
                flowName: '',
                describle: '',
                steps: []
            }
        },
        _initMethod: function () {
            $that._initSelectStaffInfo();
        },
        _initEvent: function () {

        },
        methods: {
            _initSelectStaffInfo: function () {
                $('[data-submenu]').submenupicker();
            },
            
        }
    });

})(window.vc);