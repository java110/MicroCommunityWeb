(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listCarFeeInfo: {
                fees: [],
                carNum: '',
                carId: '',
                total: 0,
                records: 1,
                areaNum: '',
                num: '',
                parkingName: ''
            }
        },
        _initMethod: function () {
            if (vc.notNull(vc.getParam("carNum"))) {
                vc.component.listCarFeeInfo.carNum = vc.getParam('carNum');
                vc.component.listCarFeeInfo.carId = vc.getParam('carId');
                vc.component.listCarFeeInfo.areaNum = vc.getParam('areaNum');
                vc.component.listCarFeeInfo.num = vc.getParam('num');
            }
            let _parkingName = "无车位";
            if ($that.listCarFeeInfo.areaNum != 'undefined') {
                _parkingName = $that.listCarFeeInfo.areaNum + "停车场" + $that.listCarFeeInfo.num + "车位";
            }
            $that.listCarFeeInfo.parkingName = _parkingName;
            vc.component._loadlistCarFeeInfo(1, 10);
        },
        _initEvent: function () {
            vc.on('listParkingSpaceFee', 'notify', function (_param) {
                vc.component._loadlistCarFeeInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    vc.component._loadlistCarFeeInfo(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadlistCarFeeInfo: function (_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: vc.component.listCarFeeInfo.carId
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.listCarFeeInfo.total = _feeConfigInfo.total;
                        vc.component.listCarFeeInfo.records = _feeConfigInfo.records;
                        vc.component.listCarFeeInfo.fees = _feeConfigInfo.fees;
                        vc.emit('pagination', 'init', {
                            total: _feeConfigInfo.records,
                            dataCount: _feeConfigInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _payFee: function (_fee) {
                _fee.roomName = vc.component.listCarFeeInfo.carNum;
                vc.jumpToPage('/#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _payFeeHis: function (_fee) {
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _editFee: function (_fee) {
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _deleteFee: function (_fee) {
                // var dateA = new Date(_fee.startTime);
                // var dateB = new Date();
                // if(dateA.setHours(0, 0, 0, 0) != dateB.setHours(0, 0, 0, 0)){
                //     vc.toast("只能取消当天添加的费用");
                //     return;
                // }
                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _refreshlistCarFeeInfo: function () {
                vc.component.listCarFeeInfo._currentFeeConfigName = "";
            },
            _openCarCreateFeeAddModal: function () {
                vc.emit('carCreateFeeAdd', 'openCarCreateFeeAddModal', {
                    isMore: false,
                    car: $that.listCarFeeInfo
                });
            },
            _openAddMeterWaterModal: function () {
                vc.emit('addMeterWater', 'openAddMeterWaterModal', {
                    roomId: $that.listCarFeeInfo.carId,
                    roomName: $that.listCarFeeInfo.carNum,
                    ownerName: $that.listCarFeeInfo.parkingName,
                    objType: '6666'
                });
            },
            _goBack: function () {
                vc.goBack();
            },
            _getDeadlineTime: function (_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                return _fee.deadlineTime;
            },
            _getEndTime: function (_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return _fee.endTime;
            },
            _viewCarFeeConfig: function (_fee) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        configId: _fee.configId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        let _feeConfig = _feeConfigManageInfo.feeConfigs[0];
                        vc.emit('viewData', 'openViewDataModal', {
                            title: _fee.feeName,
                            data: {
                                "费用项ID": _feeConfig.configId,
                                "费用类型": _feeConfig.feeTypeCdName,
                                "收费项目": _feeConfig.feeName,
                                "费用标识": _feeConfig.feeFlagName,
                                "催缴类型": _feeConfig.billTypeName,
                                "付费类型": _feeConfig.paymentCd == '1200' ? '预付费' : '后付费',
                                "缴费周期": _feeConfig.paymentCycle,
                                "计费起始时间": _feeConfig.startTime,
                                "计费终止时间": _feeConfig.endTime,
                                "公式": _feeConfig.computingFormulaName,
                                "计费单价": _feeConfig.computingFormula == '2002' ? '-' : _feeConfig.squarePrice,
                                "附加/固定费用": _feeConfig.additionalAmount,
                            }
                        })
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _viewCarFee: function (_fee) {
                let _data = {
                    "费用ID": _fee.feeId,
                    "费用标识": _fee.feeFlagName,
                    "费用类型": _fee.feeTypeCdName,
                    "费用项": _fee.feeName,
                    "费用状态": _fee.stateName,
                    "建账时间": _fee.startTime,
                    "计费开始时间": $that._getEndTime(_fee),
                    "计费结束时间": $that._getDeadlineTime(_fee),
                    "批次": _fee.batchId,
                };
                _fee.feeAttrs.forEach(attr => {
                    _data[attr.specCdName] = attr.value;
                })
                vc.emit('viewData', 'openViewDataModal', {
                    title: _fee.feeName + " 详情",
                    data: _data
                });
            },
            _splitPayFee:function(_fee){
                vc.emit('splitFee', 'openSplitFeeModal',_fee);
            }
        }
    });
})(window.vc);