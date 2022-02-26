(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerCarInfo: {
                ownerCars: [],
                ownerId: ''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            //切换 至费用页面
            vc.on('simplifyOwnerCar', 'switch', function(_param) {
                if (_param.ownerId == '') {
                    return;
                }
                $that.clearSimplifyOwnerCarInfo();
                vc.copyObject(_param, $that.simplifyOwnerCarInfo)
                $that._listSimplifyOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyOwnerCar', 'listOwnerCarData', function(_param) {
                $that._listSimplifyOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSimplifyOwnerCar: function(_page, _row) {

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
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.simplifyOwnerCarInfo.ownerCars = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _addOwnerCar: function() { //出租
                vc.jumpToPage('/#/pages/property/hireParkingSpace?ownerId=' + $that.simplifyOwnerCarInfo.ownerId);
            },
            _openEditOwnerCar: function(_car) {
                vc.emit('editCar', 'openEditCar', _car);
            },
            _openDelOwnerCarModel: function(_car) {
                vc.emit('deleteOwnerCar', 'openOwnerCarModel', _car);
            },
            _deleteCarParkingSpace: function(_car) {
                vc.http.apiPost(
                    'owner.deleteCarParkingSpace',
                    JSON.stringify(_car), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            vc.toast('释放成功');
                            $that._listSimplifyOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            _addCarParkingSpace: function(_car) {
                vc.jumpToPage('/#/pages/property/carAddParkingSpace?carId=' + _car.carId);
            },
            clearSimplifyOwnerCarInfo: function() {
                $that.simplifyOwnerCarInfo = {
                    ownerCars: [],
                    ownerId: ''
                }
            },
            _toCarMember: function(car) {
                vc.jumpToPage('/#/pages/property/listOwnerCarMember?carId=' + car.carId)
            }

        }

    });
})(window.vc);