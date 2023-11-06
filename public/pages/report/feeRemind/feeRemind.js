(function (vc) {
    vc.extends({
        data: {
            feeRemindInfo: {
                _currentTab: 'reportPrePaymentFee',
                feeConfigs: [],
                moreCondition: false,
                communitys: [],
                conditions: {
                    objName: '',
                    configId: '',
                    ownerName: '',
                    link: '',
                    communityId: ''
                }
            }
        },
        _initMethod: function () {
            $that.feeRemindInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
            $that._loadStaffCommunitys();
            $that._listFeeConfigs();
            $that.changeTab($that.feeRemindInfo._currentTab);
        },
        _initEvent: function () {
            vc.on("indexContext", "_queryIndexContextData", function (_param) { });
        },
        methods: {
            changeTab: function (_tab) {
                $that.feeRemindInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', $that.feeRemindInfo.conditions)
            },
            _queryMethod: function () {
                $that.changeTab($that.feeRemindInfo._currentTab);
            },
            _listFeeConfigs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: $that.feeRemindInfo.conditions.communityId,
                        isDefault: 'F'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.feeRemindInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _moreCondition: function () {
                if (vc.component.feeRemindInfo.moreCondition) {
                    vc.component.feeRemindInfo.moreCondition = false;
                } else {
                    vc.component.feeRemindInfo.moreCondition = true;
                }
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
                            $that.feeRemindInfo.communitys = _data.communitys;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _changCommunity: function () {
                $that._listFeeConfigs();
                $that.changeTab($that.feeRemindInfo._currentTab);
            }
        }
    })
})(window.vc);