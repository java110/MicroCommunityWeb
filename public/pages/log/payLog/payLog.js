(function(vc) {
    vc.extends({
        data: {
            operateDataLogInfo: {
                _currentTab: 'feeConfigDetailHis',
                moreCondition: false,
                conditions: {
                    logStartTime: '',
                    logEndTime: '',
                    staffNameLike: '',
                    feeNameLike: '',
                    payerObjName: '',
                    ownerNameLike:'',
                    roomName:'',
                    carNumLike:'',
                    contractCode:''
                }
            }
        },
        _initMethod: function() {
            vc.initDate('startDate', function(_value) {
                $that.operateDataLogInfo.startDate = _value;
            });
            vc.initDate('endDate', function(_value) {
                $that.operateDataLogInfo.endDate = _value;
            })
            $that.changeTab($that.operateDataLogInfo._currentTab);
        },
        _initEvent: function() {},
        methods: {
            changeTab: function(_tab) {
                $that.operateDataLogInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', $that.operateDataLogInfo.conditions)
            },
            _queryDataMethod: function() {
                $that.changeTab($that.operateDataLogInfo._currentTab)
            },
            _moreCondition: function() {
                if ($that.operateDataLogInfo.moreCondition) {
                    $that.operateDataLogInfo.moreCondition = false;
                } else {
                    $that.operateDataLogInfo.moreCondition = true;
                }
            }
        }
    })
})(window.vc);