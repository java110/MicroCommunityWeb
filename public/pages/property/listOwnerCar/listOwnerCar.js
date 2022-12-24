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
                carTypeCds: [],
                leaseTypes: [],
                conditions: {
                    carNum: '',
                    carNumLike: '',
                    num: '',
                    valid: '',
                    carTypeCd: '',
                    leaseType: 'H',
                    ownerName: '',
                    link: ''
                },
                listColumns: [],
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
            //与字典表关联
            vc.getDict('owner_car', "car_type_cd", function (_data) {
                vc.component.listOwnerCarInfo.carTypeCds = _data;
            });
            //与字典表关联
            vc.getDict('owner_car', "lease_type", function (_data) {
                vc.component.listOwnerCarInfo.leaseTypes = [{
                    statusCd:'',
                    name:'全部车辆'
                }]
                _data.forEach(item=>{
                    vc.component.listOwnerCarInfo.leaseTypes.push(item);
                })
               
            });
        },
        methods: {
            swatchLeaseType:function(_item){
                $that.listOwnerCarInfo.conditions.leaseType = _item.statusCd;
                vc.component._listOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listOwnerCar: function (_page, _row) {
                let _params = $that.listOwnerCarInfo.conditions;
                _params.page = _page;
                _params.row = _row;
                _params.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: _params
                }
                param.params.carNumLike = param.params.carNumLike.trim();
                param.params.num = param.params.num.trim();
                param.params.ownerName = param.params.ownerName.trim();
                param.params.link = param.params.link.trim();
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerCars',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        $that.listOwnerCarInfo.total = _json.total;
                        $that.listOwnerCarInfo.records = _json.records;
                        $that.listOwnerCarInfo.ownerCars = _json.data;
                        $that.dealCarAttr(_json.data);
                        vc.emit('pagination', 'init', {
                            total: $that.listOwnerCarInfo.records,
                            dataCount: $that.listOwnerCarInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _addOwnerCar: function () { //出租
                vc.jumpToPage('/#/pages/property/hireParkingSpace');
            },
            _openEditOwnerCar: function (_car) {
                vc.emit('editCar', 'openEditCar', _car);
            },
            //查询
            _queryMethod: function () {
                $that._listOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMethod: function () {
                vc.component.listOwnerCarInfo.conditions.carNumLike = "";
                vc.component.listOwnerCarInfo.conditions.num = "";
                vc.component.listOwnerCarInfo.conditions.valid = "";
                vc.component.listOwnerCarInfo.conditions.leaseType = "H";
                vc.component.listOwnerCarInfo.conditions.ownerName = "";
                vc.component.listOwnerCarInfo.conditions.link = "";
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
                    JSON.stringify(_car), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $that._listOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
                            vc.toast('释放成功');
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
            _toPayFee: function (_car) {
                vc.jumpToPage('/#/pages/property/listCarFee?carId=' +
                    _car.carId + '&carNum=' + _car.carNum + '&areaNum=' + _car.areaNum + '&num=' + _car.num);
            },
            _toCarMember: function (car) {
                vc.jumpToPage('/#/pages/property/listOwnerCarMember?carId=' + car.carId)
            },
            _getCarState: function (car) {
                if (car.state != null && car.state != '' && car.state != 'undefined' && car.state == '3003') {
                    return "到期";
                }
                let _carEndTime = new Date(car.endTime);
                if (_carEndTime.getTime() > new Date().getTime()) {
                    return "正常";
                }
                return "到期";
            },
            _openOwnerCarImport: function () {
                vc.emit('importOwnerCar', 'openImportOwnerCarModal', {});
            },
            dealCarAttr: function (cars) {
                $that._getColumns(cars, function () {
                    cars.forEach(item => {
                        $that._getColumnsValue(item);
                    });
                });
            },
            _getColumnsValue: function (_car) {
                _car.listValues = [];
                if (!_car.hasOwnProperty('ownerCarAttrDto') || _car.ownerCarAttrDto.length < 1) {
                    $that.listOwnerCarInfo.listColumns.forEach(_value => {
                        _car.listValues.push('');
                    })
                    return;
                }
                let _carAttrDtos = _car.ownerCarAttrDto;
                $that.listOwnerCarInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _carAttrDtos.forEach(_attrItem => {
                        if (_value == _attrItem.specName) {
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _car.listValues.push(_tmpValue);
                })
            },
            _getColumns: function (_cars, _call) {
                $that.listOwnerCarInfo.listColumns = [];
                vc.getAttrSpec('owner_car_attr', function (data) {
                    $that.listOwnerCarInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.listOwnerCarInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
            },
        }
    })
})(window.vc);