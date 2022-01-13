(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listOwnerCarInfo: {
                ownerCars: [],
                total: 0,
                records: 1,
                num: '',
                moreCondition: false,
                conditions: {
                    carNum: '',
                    carNumLike: '',
                    num: '',
                    valid: '',
                    carTypeCd: '1001'
                }
            }
        },
        _initMethod: function () {
            $that._listOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('listOwnerCar', 'listOwnerCarData', function () {
                $that._listOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listOwnerCar(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOwnerCar: function (_page, _row) {
                let _params = $that.listOwnerCarInfo.conditions;
                _params.page = _page;
                _params.row = _row;
                _params.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: _params
                }
                //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        $that.listOwnerCarInfo.total = _json.total;
                        $that.listOwnerCarInfo.records = _json.records;
                        $that.listOwnerCarInfo.ownerCars = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.listOwnerCarInfo.records,
                            dataCount: $that.listOwnerCarInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _addOwnerCar: function () { //出租
                vc.jumpToPage('/admin.html#/pages/property/hireParkingSpace');
            },
            _openEditOwnerCar: function (_car) {
                vc.emit('editCar', 'openEditCar', _car);
            },
            _queryMethod: function () {
                $that._listOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.listOwnerCarInfo.moreCondition) {
                    $that.listOwnerCarInfo.moreCondition = false;
                } else {
                    $that.listOwnerCarInfo.moreCondition = true;
                }
            },
            _openDelOwnerCarModel: function (_car) {
                vc.emit('deleteOwnerCar', 'openOwnerCarModel', _car);
            },
            _deleteCarParkingSpace: function (_car) {
                vc.http.apiPost(
                    'owner.deleteCarParkingSpace',
                    JSON.stringify(_car),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            vc.toast('释放成功');
                            $that._listOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _addCarParkingSpace: function (_car) {
                vc.jumpToPage('/admin.html#/pages/property/carAddParkingSpace?carId=' + _car.carId);
            },
            _toPayFee: function (_car) {
                vc.jumpToPage('/admin.html#/pages/property/listCarFee?carId='
                    + _car.carId + '&carNum=' + _car.carNum + '&areaNum=' + _car.areaNum + '&num=' + _car.num);
            },
            _toCarMember: function (car) {
                vc.jumpToPage('/admin.html#/pages/property/listOwnerCarMember?carId=' + car.carId)
            },
            _getCarState: function (car) {
                let _carEndTime = new Date(car.endTime);
                if (_carEndTime.getTime() > new Date().getTime()) {
                    return "正常";
                }
                return "到期";
            },
            _openOwnerCarImport: function () {
                vc.emit('importOwnerCar', 'openImportOwnerCarModal', {});
            },
        }
    })
})(window.vc);