(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerCarInfo: {
                ownerCars: [],
                ownerId: '',
                total: 0,
                records: 1,
                ownerName: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyOwnerCar', 'switch', function (_param) {
                if (_param.ownerId == '') {
                    return;
                }
                $that.clearSimplifyOwnerCarInfo();
                vc.copyObject(_param, $that.simplifyOwnerCarInfo)
                $that._listSimplifyOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyOwnerCar', 'listOwnerCarData', function (_param) {
                $that._listSimplifyOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSimplifyOwnerCar: function (_page, _row) {
                let param = {
                    params: {
                        page: 1,
                        row: 19,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.simplifyOwnerCarInfo.ownerId,
                        carTypeCd: '1001'
                    }
                }
                //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.simplifyOwnerCarInfo.ownerCars = _json.data;
                        vc.component.simplifyOwnerCarInfo.total = _json.total;
                        vc.component.simplifyOwnerCarInfo.records = _json.records;
                        vc.emit('simplifyOwnerCar', 'paginationPlus', 'init', {
                            total: vc.component.simplifyOwnerCarInfo.records,
                            dataCount: vc.component.simplifyOwnerCarInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _addOwnerCar: function () { //添加车辆
                vc.jumpToPage('/#/pages/property/hireParkingSpace?ownerId=' + $that.simplifyOwnerCarInfo.ownerId + "&ownerName=" + $that.simplifyOwnerCarInfo.ownerName);
            },
            _openEditOwnerCar: function (_car) {
                vc.emit('editCar', 'openEditCar', _car);
            },
            _openDelOwnerCarModel: function (_car) {
                vc.emit('deleteOwnerCar', 'openOwnerCarModel', _car);
            },
            _deleteCarParkingSpace: function (_car) {
                vc.http.apiPost(
                    'owner.deleteCarParkingSpace',
                    JSON.stringify(_car), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (res.status == 200 && _json.code == 0) {
                            vc.toast('释放成功');
                            $that._listSimplifyOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _addCarParkingSpace: function (_car) {
                vc.jumpToPage('/#/pages/property/carAddParkingSpace?carId=' + _car.carId);
            },
            clearSimplifyOwnerCarInfo: function () {
                $that.simplifyOwnerCarInfo = {
                    ownerCars: [],
                    ownerId: ''
                }
            },
            _toCarMember: function (car) {
                vc.jumpToPage('/#/pages/property/listOwnerCarMember?carId=' + car.carId)
            }
        }
    });
})(window.vc);