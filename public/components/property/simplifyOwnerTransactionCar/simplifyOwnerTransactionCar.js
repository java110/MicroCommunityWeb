(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerTransactionCarInfo: {
                machineTranslates: [],
                ownerId: '',
                carId: '',
                ownerCars: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyOwnerTransactionCar', 'switch', function (_param) {
                vc.copyObject(_param, $that.simplifyOwnerTransactionCarInfo)
                $that._listTransactionOwnerCar()
                    .then((data) => {
                        $that._listSimplifyOwnerTransactionCar(DEFAULT_PAGE, DEFAULT_ROWS);
                    }, (err) => {

                    })

            });
        },
        methods: {
            _listSimplifyOwnerTransactionCar: function (_page, _row) {

                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        objId: $that.simplifyOwnerTransactionCarInfo.carId,
                        typeCd: '4455'
                    }
                }

                //发送get请求
                vc.http.get('machineTranslateManage',
                    'list',
                    param,
                    function (json, res) {
                        var _machineTranslateManageInfo = JSON.parse(json);
                        vc.component.simplifyOwnerTransactionCarInfo.total = _machineTranslateManageInfo.total;
                        vc.component.simplifyOwnerTransactionCarInfo.records = _machineTranslateManageInfo.records;
                        vc.component.simplifyOwnerTransactionCarInfo.machineTranslates = _machineTranslateManageInfo.machineTranslates;
                        vc.emit('pagination', 'init', {
                            total: vc.component.simplifyOwnerTransactionCarInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _openEditCarTranslateModel: function (_machineTranslate) {
                vc.emit('editMachineTranslate', 'openEditMachineTranslateModal', _machineTranslate);
            },

            _listTransactionOwnerCar: function () {
                return new Promise((resolve, reject) => {
                    let param = {
                        params: {
                            page: 1,
                            row: 50,
                            ownerId: $that.simplifyOwnerTransactionCarInfo.ownerId,
                            communityId: vc.getCurrentCommunity().communityId
                        }
                    }
                    //发送get请求
                    vc.http.apiGet('owner.queryOwnerCars',
                        param,
                        function (json, res) {

                            let _json = JSON.parse(json);
                            $that.simplifyOwnerTransactionCarInfo.ownerCars = _json.data;

                            if (_json.data.length > 0) {
                                $that.simplifyOwnerTransactionCarInfo.carId = _json.data[0].carId
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

            changeTransactionCar: function () {
                let _car = null;
                $that.simplifyOwnerTransactionCarInfo.ownerCars.forEach(item => {
                    if (item.carId == $that.simplifyOwnerTransactionCarInfo.carId) {
                        _car = item;
                    }
                });

                if (_car == null) {
                    return;
                }
                $that._listSimplifyOwnerTransactionCar();
            }
        }

    });
})(window.vc);
