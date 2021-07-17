(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listOwnerCarMemberInfo: {
                ownerCars: [],
                total: 0,
                records: 1,
                num: '',
                moreCondition: false,
                carId: ''
            }
        },
        _initMethod: function () {
            $that.listOwnerCarMemberInfo.carId = vc.getParam('carId');
            $that._listOwnerCarMember(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('listOwnerCarMember', 'listOwnerCarData', function () {
                $that._listOwnerCarMember(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listOwnerCarMember(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOwnerCarMember: function (_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        carId: $that.listOwnerCarMemberInfo.carId,
                        carTypeCd: '1002'
                    }
                }

                //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);

                        $that.listOwnerCarMemberInfo.total = _json.total;
                        $that.listOwnerCarMemberInfo.records = _json.records;
                        $that.listOwnerCarMemberInfo.ownerCars = _json.data;

                        vc.emit('pagination', 'init', {
                            total: $that.listOwnerCarMemberInfo.records,
                            dataCount: $that.listOwnerCarMemberInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _addOwnerCarMember: function () {
                vc.emit('addCarModal', 'openAddCarModel', {
                    carId: $that.listOwnerCarMemberInfo.carId
                });
            },
            _openEditOwnerCar: function (_car) {
                vc.emit('editCar', 'openEditCar', _car);
            },
            _openDelOwnerCarModel: function (_car) {
                vc.emit('deleteOwnerCar', 'openOwnerCarModel', _car);
            },
            _getBack:function(){
                vc.goBack();
            }
        }
    })
})(window.vc);