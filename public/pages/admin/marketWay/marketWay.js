/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            marketWayInfo: {
                _currentTab: 'marketWayText',
            }
        },
        _initMethod: function() {
            vc.emit('marketWayText', 'notify', {
            });
        },
        _initEvent: function() {
            vc.on('marketWay', 'notify', function(_param) {
                vc.copyObject(_param, $that.marketWayInfo);
            })
        },
        methods: {
            changeTab: function(_tab) {
                $that.marketWayInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                })
            },
        }
    });
})(window.vc);