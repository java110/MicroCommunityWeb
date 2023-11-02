(function (vc) {
    vc.extends({
        data: {
            reportFeeDetailInfo: {
                _currentTab: 'reportFeeDetailRoom',
                floors: [],
                moreCondition: false,
                conditions: {
                    floorId: '',
                    objName: '',
                    startDate: '',
                    endDate: '',
                    configId: '',
                    feeTypeCd: '',
                    ownerName: '',
                    link: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            $that._initDate();
            vc.component.changeTab($that.reportFeeDetailInfo._currentTab);
        },
        _initEvent: function () {
            vc.on("indexContext", "_queryIndexContextData", function (_param) {
            });
        },
        methods: {
            _initDate: function () {
                vc.initDate('startDate', function (_value) {
                    $that.reportFeeDetailInfo.conditions.startDate = _value;
                });
                vc.initDate('endDate', function (_value) {
                    $that.reportFeeDetailInfo.conditions.endDate = _value;
                });
                let _data = new Date();
                let _month = _data.getMonth() + 1;
                let _newDate = "";
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + "-01";
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + "-01";
                }
                $that.reportFeeDetailInfo.conditions.startDate = _newDate;
                _data.setMonth(_data.getMonth() + 1);
                _month = _data.getMonth() + 1;
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + "-01";
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + "-01";
                }
                $that.reportFeeDetailInfo.conditions.endDate = _newDate;
            },
            changeTab: function (_tab) {
                $that.reportFeeDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', $that.reportFeeDetailInfo.conditions)
            },
            //查询
            _queryMethod: function () {
                vc.component.changeTab($that.reportFeeDetailInfo._currentTab);
            },
            //重置
            _resetMethod: function () {
                vc.component.reportFeeDetailInfo.conditions.objName = "";
                vc.component.reportFeeDetailInfo.conditions.ownerName = "";
                vc.component.reportFeeDetailInfo.conditions.link = "";
                vc.component.changeTab($that.reportFeeDetailInfo._currentTab);
            },
            _moreCondition: function () {
                if (vc.component.reportFeeDetailInfo.moreCondition) {
                    vc.component.reportFeeDetailInfo.moreCondition = false;
                } else {
                    vc.component.reportFeeDetailInfo.moreCondition = true;
                }
            },
        }
    })
})(window.vc);