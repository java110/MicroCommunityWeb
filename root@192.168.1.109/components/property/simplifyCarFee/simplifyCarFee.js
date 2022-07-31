(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            simplifyCarFeeInfo: {
                fees: [],
                ownerCars: [],
                ownerId: '',
                name: '',
                carNum: '',
                carId: '',
                total: 0,
                records: 1,
                areaNum: '',
                num: '',
                parkingName: '',
                totalAmount: 0.0
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyCarFee', 'switch', function (_param) {
                if (_param.ownerId == '') {
                    return;
                }
                $that.clearSimplifyCarFeeInfo();
                vc.copyObject(_param, $that.simplifyCarFeeInfo)
                $that._listOwnerCar()
                    .then((data) => {
                        console.log('data', data);
                        $that._listSimplifyCarFee(DEFAULT_PAGE, DEFAULT_ROWS);
                    }, (err) => {
                        //vc.toast(err);
                    })
            });
            vc.on('simplifyCarFee', 'notify', function () {
                $that._listSimplifyCarFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyCarFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._listSimplifyCarFee(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyCarFee: function (_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: vc.component.simplifyCarFeeInfo.carId
                    }
                };
                if (!vc.component.simplifyCarFeeInfo.carId) {
                    return;
                }
                //发送get请求
                vc.http.get('listParkingSpaceFee',
                    'list',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.simplifyCarFeeInfo.total = _feeConfigInfo.total;
                        vc.component.simplifyCarFeeInfo.records = _feeConfigInfo.records;
                        vc.component.simplifyCarFeeInfo.fees = _feeConfigInfo.fees;
                        let _totalAmount = 0.0;
                        _feeConfigInfo.fees.forEach(item => {
                            _totalAmount += parseFloat(item.amountOwed);
                        })
                        $that.simplifyCarFeeInfo.totalAmount = _totalAmount;
                        vc.emit('simplifyCarFee', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _simplifyCarPayFee: function (_fee) {
                _fee.roomName = vc.component.simplifyCarFeeInfo.carNum;
                //vc.jumpToPage('/#/pages/property/payFeeOrder?' + vc.objToGetParam(_fee));
                vc.jumpToPage('/#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _simplifyCarPayFeeHis: function (_fee) {
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _simplifyCarEditFee: function (_fee) {
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _simplifyCarDeleteFee: function (_fee) {
                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _openSimplifyCarCreateFeeAddModal: function () {
                vc.emit('carCreateFeeAdd', 'openCarCreateFeeAddModal', {
                    isMore: false,
                    car: $that.simplifyCarFeeInfo
                });
            },
            _simplifyCarFinishFee: function (_fee) {
                vc.emit('finishFee', 'openFinishFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            /*_openSimplifyCarAddMeterWaterModal: function() {
                vc.emit('addMeterWater', 'openAddMeterWaterModal', {
                    roomId: $that.simplifyCarFeeInfo.carId,
                    roomName: $that.simplifyCarFeeInfo.carNum,
                    ownerName: $that.simplifyCarFeeInfo.parkingName,
                    objType: '6666'
                });
            },*/
            _getSimplifyCarDeadlineTime: function (_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                return _fee.deadlineTime;
            },
            _getSimplifyCarEndTime: function (_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return _fee.endTime;
            },
            _listOwnerCar: function () {
                return new Promise((resolve, reject) => {
                    let param = {
                        params: {
                            page: 1,
                            row: 50,
                            ownerId: $that.simplifyCarFeeInfo.ownerId,
                            communityId: vc.getCurrentCommunity().communityId
                        }
                    }
                    //发送get请求
                    vc.http.apiGet('owner.queryOwnerCars',
                        param,
                        function (json, res) {
                            let _json = JSON.parse(json);
                            $that.simplifyCarFeeInfo.ownerCars = _json.data;
                            if (_json.data.length > 0) {
                                $that.simplifyCarFeeInfo.carId = _json.data[0].carId;
                                $that.simplifyCarFeeInfo.carNum = _json.data[0].carNum;
                                $that.simplifyCarFeeInfo.num = _json.data[0].num;
                                $that.simplifyCarFeeInfo.parkingName = _json.data[0].areaNum + '停车场' + _json.data[0].num + '停车位';
                                resolve(_json.data);
                                return;
                            }
                            reject("没有车位");
                        },
                        function (errInfo, error) {
                            reject(errInfo);
                        }
                    );
                })
            },
            changeSimplifyCar: function () {
                let _car = null;
                $that.simplifyCarFeeInfo.ownerCars.forEach(item => {
                    if (item.carId == $that.simplifyCarFeeInfo.carId) {
                        _car = item;
                    }
                });
                if (_car == null) {
                    return;
                }
                $that.simplifyCarFeeInfo.carNum = _car.carNum;
                $that.simplifyCarFeeInfo.num = _car.num;
                $that.simplifyCarFeeInfo.parkingName = _car.areaNum + '停车场' + _car.num + '停车位';
                $that._listSimplifyCarFee(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            clearSimplifyCarFeeInfo: function () {
                $that.simplifyCarFeeInfo = {
                    fees: [],
                    ownerCars: [],
                    ownerId: '',
                    name: '',
                    carNum: '',
                    carId: '',
                    total: 0,
                    records: 1,
                    areaNum: '',
                    num: '',
                    parkingName: '',
                    totalAmount: 0.0
                }
            },
            _simplifyCarGetFeeOwnerInfo: function (attrs) {
                let ownerName = $that._getAttrValue(attrs, '390008');
                let ownerLink = $that._getAttrValue(attrs, '390009');
                return '业主：' + ownerName + ',电话：' + ownerLink;
            },
            _openBatchPayCarFeeModal: function () {
                vc.jumpToPage('/#/pages/property/batchPayFeeOrder?ownerId=' + $that.simplifyCarFeeInfo.ownerId + "&payerObjType=6666")
            },
            _viewCarFeeConfig:function(_fee){
                let param = {
                    params:{
                        page:1,
                        row:1,
                        communityId:vc.getCurrentCommunity().communityId,
                        configId:_fee.configId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        let  _feeConfig = _feeConfigManageInfo.feeConfigs[0];
                        vc.emit('viewData', 'openViewDataModal',{
                            title:_fee.feeName,
                            data:{
                                "费用项ID":_feeConfig.configId,
                                "费用类型":_feeConfig.feeTypeCdName,
                                "收费项目":_feeConfig.feeName,
                                "费用标识":_feeConfig.feeFlagName,
                                "催缴类型":_feeConfig.billTypeName,
                                "付费类型":_feeConfig.paymentCd == '1200' ? '预付费':'后付费',
                                "缴费周期":_feeConfig.paymentCycle,
                                "计费起始时间":_feeConfig.startTime,
                                "计费终止时间":_feeConfig.endTime,
                                "公式":_feeConfig.computingFormulaName,
                                "计费单价":_feeConfig.computingFormula == '2002' ? '-':_feeConfig.squarePrice,
                                "附加/固定费用":_feeConfig.additionalAmount,
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
                    "付费对象": _fee.payerObjName,
                    "费用项": _fee.feeName,
                    "费用状态": _fee.stateName,
                    "建账时间": _fee.startTime,
                    "计费开始时间": $that._getEndTime(_fee),
                    "计费结束时间": $that._getDeadlineTime(_fee),
                    "批次": _fee.batchId,
                };

                _fee.feeAttrs.forEach(attr=>{
                    _data[attr.specCdName] = attr.value;
                })
                vc.emit('viewData', 'openViewDataModal', {
                    title: _fee.feeName + " 详情",
                    data: _data
                });
            }

        }
    });
})(window.vc);