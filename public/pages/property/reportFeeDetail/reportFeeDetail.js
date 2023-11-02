(function (vc) {
    vc.extends({
        data: {
            reportFeeDetailInfo: {
                _currentTab: 'reportFeeDetailRoom',
                floors: [],
                moreCondition: false,
                communitys:[],
                conditions: {
                    floorId: '',
                    objName: '',
                    startDate: '',
                    endDate: '',
                    configId: '',
                    feeTypeCd: '',
                    ownerName: '',
                    link: '',
                    communityId: ''
                }
            }
        },
        _initMethod: function () {
            $that._initDate();
            $that._loadStaffCommunitys();
            $that.reportFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
            $that.changeTab($that.reportFeeDetailInfo._currentTab);


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
            _queryMethod: function() {
                $that.changeTab($that.reportFeeDetailInfo._currentTab);
            },
            _loadStaffCommunitys: function () {
                let param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: 1,
                        row: 100,
                    }
                };
                vc.http.apiGet('/community.listMyEnteredCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _data = JSON.parse(json);
                            $that.reportFeeDetailInfo.communitys = _data.communitys;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _changCommunity:function(){
                $that.changeTab($that.reportFeeDetailInfo._currentTab);
            }
        }
    })
})(window.vc);