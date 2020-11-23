(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
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
                parkingName: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyCarFee', 'switch', function (_param) {
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
                //发送get请求
                vc.http.get('listParkingSpaceFee',
                    'list',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.simplifyCarFeeInfo.total = _feeConfigInfo.total;
                        vc.component.simplifyCarFeeInfo.records = _feeConfigInfo.records;
                        vc.component.simplifyCarFeeInfo.fees = _feeConfigInfo.fees;
                        vc.emit('simplifyCarFee', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _simplifyCarPayFee: function (_fee) {
                _fee.roomName = vc.component.simplifyCarFeeInfo.carNum;
                vc.jumpToPage('/admin.html#/pages/property/payFeeOrder?' + vc.objToGetParam(_fee));
            },
            _simplifyCarPayFeeHis: function (_fee) {
                vc.jumpToPage('/admin.html#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
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
            _openSimplifyCarAddMeterWaterModal: function () {

                vc.emit('addMeterWater', 'openAddMeterWaterModal', {
                    roomId: $that.simplifyCarFeeInfo.carId,
                    roomName: $that.simplifyCarFeeInfo.carNum,
                    ownerName: $that.simplifyCarFeeInfo.parkingName,
                    objType: '6666'
                });
            },
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
                        }, function (errInfo, error) {
                            reject(errInfo);
                        }
                    );

                })

            },

            changeCar: function () {
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
                $that._listSimplifyCarFee();
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
                    parkingName: ''
                }
            }

        }

    });
})(window.vc);
