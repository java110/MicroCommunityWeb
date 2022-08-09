(function(vc) {
    vc.extends({
        data: {
            reportHuaningInfo: {
                receivableAmount: '0',
                noEnterRoomCount: '0',
                roomCount: '0',
                freeRoomCount: '0',
                parkingSpaceCount: '0',
                freeParkingSpaceCount: '0',
                shopCount: '0',
                freeShopCount: '0',
                _currentTab: 'reportHuaningOweFee',
                feeTypeCds: [],
                feeConfigDtos: [],
                floors: [],
                moreCondition: false,
                conditions: {
                    configId: '',
                    feeTypeCd: '',
                    floorNum: '',
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1
                }
            }
        },
        _initMethod: function() {
            vc.component.changeTab($that.reportHuaningInfo._currentTab);
            //关联字典表费用类型
            vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                vc.component.reportHuaningInfo.feeTypeCds = _data;
            });
            $that._listFloorData();
        },
        _initEvent: function() {
            vc.on("indexContext", "_queryIndexContextData", function(_param) {
                vc.component._queryIndexContextData();
            });
        },
        methods: {
            changeTab: function(_tab) {
                $that.reportHuaningInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', $that.reportHuaningInfo.conditions)
            },
            _changeReporficientFeeTypeCd: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: $that.reportHuaningInfo.conditions.feeTypeCd,
                        isDefault: '',
                        feeFlag: '',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function(json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        let _feeConfigs = _feeConfigManageInfo.feeConfigs
                        vc.component.reportHuaningInfo.feeConfigDtos = _feeConfigs;
                        /*if (_feeConfigs.length > 0) {
                            $that.reportHuaningInfo.conditions.configId = _feeConfigs[0].configId;
                            //$that.changeTab($that.reportHuaningInfo._currentTab)
                        }*/
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _changeReporficientConfigId: function() {
                $that.changeTab($that.reportHuaningInfo._currentTab)
            },
            _queryMethod: function() {
                $that.changeTab($that.reportHuaningInfo._currentTab)
            },
            _resetMethod: function() {
                vc.component.reportHuaningInfo.conditions.feeTypeCd = "";
                vc.component.reportHuaningInfo.conditions.configId = "";
                vc.component.reportHuaningInfo.conditions.floorNum = "";
                vc.component.reportHuaningInfo.conditions.year = "";
                vc.component.reportHuaningInfo.conditions.month = "";
                vc.component.reportHuaningInfo.feeConfigDtos = [];
                $that.changeTab($that.reportHuaningInfo._currentTab)
            },
            _getReportProficientRoomName: function() {
                if (vc.component.reportHuaningInfo == undefined) {
                    return '请填写房屋编号';
                }
                if (vc.component.reportHuaningInfo._currentTab == 'reportHuaningRoomFee') {
                    return '请填写房屋编号'
                }
                return '请填写车牌号';
            },
            _exportFee: function() {
                let _objType = vc.component.reportHuaningInfo._currentTab == 'reportHuaningRoomFee' ? "3333" : "6666"
                vc.jumpToPage('/callComponent/exportReportFee/exportData?communityId=' +
                    vc.getCurrentCommunity().communityId +
                    "&configId=" + $that.reportHuaningInfo.conditions.configId +
                    "&feeTypeCd=" + $that.reportHuaningInfo.conditions.feeTypeCd +
                    "&objType=" + _objType +
                    "&pagePath=reportYearCollection");
            },
            _listFloorData: function(_page, _rows) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        row: 50,
                        page: 1
                    }
                };
                //发送get请求
                vc.http.apiGet('/floor.queryFloors',
                    param,
                    function(json, res) {
                        var listFloorData = JSON.parse(json);
                        vc.component.reportHuaningInfo.floors = listFloorData.apiFloorDataVoList;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function() {
                if (vc.component.reportHuaningInfo.moreCondition) {
                    vc.component.reportHuaningInfo.moreCondition = false;
                } else {
                    vc.component.reportHuaningInfo.moreCondition = true;
                }
            }
        }
    })
})(window.vc);