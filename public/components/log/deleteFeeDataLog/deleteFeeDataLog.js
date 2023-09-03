/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            deleteFeeDataLogInfo: {
                fees: [],
                feeId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteFeeDataLog', 'switch', function (_data) {
                $that.deleteFeeDataLogInfo.feeId = _data.feeId;
                $that._loadDeleteFeeDataLogData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('deleteFeeDataLog', 'notify',
                function (_data) {
                    $that._loadDeleteFeeDataLogData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('deleteFeeDataLog', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadDeleteFeeDataLogData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadDeleteFeeDataLogData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        deleteFlag:'DEL',
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/fee.queryHisFee',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.deleteFeeDataLogInfo.fees = _roomInfo.data;
                        vc.emit('deleteFeeDataLog', 'paginationPlus', 'init', {
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
            _qureyDeleteFeeDataLog: function () {
                $that._loadDeleteFeeDataLogData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);