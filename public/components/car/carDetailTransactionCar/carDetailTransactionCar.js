/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carDetailTransactionCarInfo: {
                machineTranslates: [],
                ownerId: '',
                carId: '',
                memberId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('carDetailTransactionCar', 'switch', function (_data) {
                $that.carDetailTransactionCarInfo.carId = _data.carId;
                $that.carDetailTransactionCarInfo.memberId = _data.memberId;
                $that._loadCarDetailTransactionCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('carDetailTransactionCar', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadCarDetailTransactionCarData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadCarDetailTransactionCarData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        objId: $that.carDetailTransactionCarInfo.memberId,
                        typeCd: '4455'
                    }
                };

                //发送get请求
                vc.http.apiGet('/machineTranslate.listMachineTranslates',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.carDetailTransactionCarInfo.machineTranslates = _roomInfo.machineTranslates;
                        vc.emit('carDetailTransactionCar', 'paginationPlus', 'init', {
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
            _qureyCarDetailTransactionCar: function () {
                $that._loadCarDetailTransactionCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openEditMachineTranslateModel: function (_machineTranslate) {
                vc.emit('editMachineTranslate', 'openEditMachineTranslateModal', _machineTranslate);
            },
        }
    });
})(window.vc);