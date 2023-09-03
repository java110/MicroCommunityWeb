/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailImportInfo: {
                importFeeDetails: [],
                feeId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailImport', 'switch', function (_data) {
                $that.feeDetailImportInfo.feeId = _data.feeId;
                $that._loadFeeDetailImportData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailImport', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailImportData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeDetailImportData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: $that.feeDetailImportInfo.feeId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/importFee/queryImportFeeDetail',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.feeDetailImportInfo.importFeeDetails = _roomInfo.data;
                        vc.emit('feeDetailImport', 'paginationPlus', 'init', {
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
            _qureyFeeDetailImport: function () {
                $that._loadFeeDetailImportData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);