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
                    num: '',
                    state:''
                }
            }
        },
        _initMethod: function () {
            $that._listOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('lisOwnerCar', 'listOwnerCarData', function () {
                $that._listOwnerCar(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listOwnerCar(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOwnerCar: function (_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
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
            _addOwnerCar:function(){ //出租
                vc.jumpToPage('/admin.html#/pages/property/hireParkingSpace');
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
            _openDelOwnerCarModel:function(_car){
                vc.emit('deleteOwnerCar','openOwnerCarModel',_car);
            },
        }
    })
})(window.vc);