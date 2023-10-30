/**
    入驻小区
**/
(function (vc) {
    vc.extends({
        data: {
            devIndexInfo: {
                hostCount: 0,
                datas: [],
                action: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('devIndex', 'initData', function (_param) {
                // $that._loadViewAdminData();
                // $that._loadCommunityFee();
                // $that._loadCommunityRepair();
            });
        },
        methods: {

            
        }
    });
})(window.vc);