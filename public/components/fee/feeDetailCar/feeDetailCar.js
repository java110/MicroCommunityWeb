/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailCarInfo: {
                cars: [],
                memberId:'',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailCar', 'switch', function (_data) {
                $that.feeDetailCarInfo.memberId = _data.payerObjId;
                $that._loadFeeDetailCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailCar', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailCarData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('feeDetailCar', 'notify', function (_data) {
                $that._loadFeeDetailCarData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadFeeDetailCarData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        memberId:$that.feeDetailCarInfo.memberId,
                        page:_page,
                        row:_row
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerCars',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.feeDetailCarInfo.cars = _roomInfo.data;
                        vc.emit('feeDetailCar', 'paginationPlus', 'init', {
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
            _qureyFeeDetailCar: function () {
                $that._loadFeeDetailCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);