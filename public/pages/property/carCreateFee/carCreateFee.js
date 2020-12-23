/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        data: {
            parkingSpaceUnits: [],
            carCreateFeeInfo: {
                cars: [],
                states: [],
                total: 0,
                records: 1,
                floorId: '',
                unitId: '',
                state: '',
                num: '',
                moreCondition: false,
                conditions: {
                    psId: '',
                    ownerName: '',
                    carNum: '',
                    allNum: '',
                    state: ''
                }
            }
        },
        _initMethod: function () {
            vc.component.listCars(DEFAULT_PAGE, DEFAULT_ROW);
            vc.getDict('owner_car', 'state', function (_data) {
                vc.component.carCreateFeeInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component.listCars(_currentPage, DEFAULT_ROW);
            });
        },
        methods: {
            listCars: function (_page, _row) {
                vc.component.carCreateFeeInfo.conditions.page = _page;
                vc.component.carCreateFeeInfo.conditions.row = _row;
                vc.component.carCreateFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let _allNum = $that.carCreateFeeInfo.conditions.allNum;
                let _conditions = JSON.parse(JSON.stringify(vc.component.carCreateFeeInfo.conditions));
                let param = {
                    params: _conditions
                };
                if (_allNum.split('-').length == 2) {
                    let _allNums = _allNum.split('-')
                    param.params.areaNum = _allNums[0];
                    param.params.num = _allNums[1];
                }
                //车牌号选框去空
                param.params.carNum = param.params.carNum.trim();
                //业主名称选框去空
                param.params.ownerName = param.params.ownerName.trim();
                //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function (json, res) {
                        var listCarData = JSON.parse(json);
                        vc.component.carCreateFeeInfo.total = listCarData.total;
                        vc.component.carCreateFeeInfo.records = listCarData.records;
                        vc.component.carCreateFeeInfo.cars = listCarData.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.carCreateFeeInfo.records,
                            dataCount: vc.component.carCreateFeeInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openCarCreateFeeAddModal: function (_car, _isMore) {
                vc.emit('carCreateFeeAdd', 'openCarCreateFeeAddModal', {
                    isMore: _isMore,
                    car: _car
                });
            },
            //重置操作
            resetListCars: function (_page, _row) {
                vc.component.carCreateFeeInfo.conditions.psId = "";
                vc.component.carCreateFeeInfo.conditions.ownerName = "";
                vc.component.carCreateFeeInfo.conditions.carNum = "";
                vc.component.carCreateFeeInfo.conditions.allNum = "";
                vc.component.carCreateFeeInfo.conditions.state = "";
                let _conditions = JSON.parse(JSON.stringify(vc.component.carCreateFeeInfo.conditions));
                let param = {
                    params: _conditions
                };
                //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function (json, res) {
                        var listCarData = JSON.parse(json);
                        vc.component.carCreateFeeInfo.total = listCarData.total;
                        vc.component.carCreateFeeInfo.records = listCarData.records;
                        vc.component.carCreateFeeInfo.cars = listCarData.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.carCreateFeeInfo.records,
                            dataCount: vc.component.carCreateFeeInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openViewParkingSpaceCreateFee: function (_car) {
                vc.jumpToPage("/admin.html#/pages/property/listCarFee?carId=" + _car.carId + "&carNum=" + _car.carNum + "&areaNum=" + _car.areaNum + "&num=" + _car.num);
            },
            //查询
            _queryParkingSpaceMethod: function () {
                vc.component.listCars(DEFAULT_PAGE, DEFAULT_ROW);
            },
            //重置
            _resetParkingSpaceMethod: function () {
                vc.component.resetListCars(DEFAULT_PAGE, DEFAULT_ROW);
            },
            _moreCondition: function () {
                if (vc.component.carCreateFeeInfo.moreCondition) {
                    vc.component.carCreateFeeInfo.moreCondition = false;
                } else {
                    vc.component.carCreateFeeInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);