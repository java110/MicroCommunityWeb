/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailCarInfo: {
                cars: [],
                ownerId: '',
                ownerName:'',
                carNum: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailCar', 'switch', function (_data) {
                $that.ownerDetailCarInfo.ownerId = _data.ownerId;
                $that.ownerDetailCarInfo.ownerName = _data.ownerName;

                $that._loadOwnerDetailCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailCar', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailCarData(_currentPage, DEFAULT_ROWS);
                });
                vc.on('ownerDetailCar', 'notify', function (_data) {
                    $that._loadOwnerDetailCarData(DEFAULT_PAGE,DEFAULT_ROWS);
                })
        },
        methods: {
            _loadOwnerDetailCarData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerDetailCarInfo.ownerId,
                        carNum: $that.ownerDetailCarInfo.carNum,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/owner.queryOwnerCars',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailCarInfo.cars = _roomInfo.data;
                        vc.emit('ownerDetailCar', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyOwnerDetailCar: function () {
                $that._loadOwnerDetailCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _addOwnerCar: function () { //出租
                vc.jumpToPage('/#/pages/property/hireParkingSpace?ownerId=' + $that.ownerDetailCarInfo.ownerId+"&ownerName="+$that.ownerDetailCarInfo.ownerName);
            },
            _openEditOwnerCar: function (_car) {
                vc.emit('editCar', 'openEditCar', _car);
            },
            _openDelOwnerCarModel: function (_car) {
                vc.emit('deleteOwnerCar', 'openOwnerCarModel', _car);
            },
            _deleteCarParkingSpace: function (_car) {
                vc.http.apiPost(
                    '/owner.deleteCarParkingSpace',
                    JSON.stringify(_car), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (res.status == 200 && _json.code == 0) {
                            vc.toast('释放成功');
                            $that._loadOwnerDetailCarData(DEFAULT_PAGE, DEFAULT_ROWS);
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
        }
    });
})(window.vc);