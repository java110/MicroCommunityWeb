/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            parkingAreaControlInfo: {
                _currentTab: 'parkingAreaControlCarInout',
                paId: ''

            }
        },
        _initMethod: function () {
            $that.parkingAreaControlInfo.paId = vc.getParam('paId');
            vc.emit('parkingAreaControlVideo', 'notify', {
                paId: $that.parkingAreaControlInfo.paId
            });
        },
        _initEvent: function () {

        },
        methods: {
            changeTab: function (_tab) {
                $that.parkingAreaControlInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    paId: $that.parkingAreaControlInfo.paId
                })
            },
        }
    });
})(window.vc);