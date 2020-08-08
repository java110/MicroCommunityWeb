/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomFeeImport: {
                improtFees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                conditions: {
                    importFeeId: '',

                }
            }
        },
        _initMethod: function () {
           $that._listFees(DEFAULT_PAGE,DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('roomFeeImport', 'listFee', function (_param) {
                vc.component._listImportFees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listbills(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listImportFees: function (_page, _rows) {

                vc.component.roomFeeImport.conditions.page = _page;
                vc.component.roomFeeImport.conditions.row = _rows;
                vc.component.roomFeeImport.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.roomFeeImport.conditions
                };

                //发送get请求
                vc.http.apiGet('/importFee/queryImportFee',
                    param,
                    function (json, res) {
                        var _roomFeeImport = JSON.parse(json);
                        vc.component.roomFeeImport.total = _roomFeeImport.total;
                        vc.component.roomFeeImport.records = _roomFeeImport.records;
                        vc.component.roomFeeImport.improtFees = _roomFeeImport.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.roomFeeImport.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openImportFeeDetail: function (_bill) {
                vc.jumpToPage('/admin.html#/pages/property/billOweManage?'+vc.objToGetParam(_bill));

            },
            _queryImportFeeMethod: function () {
                vc.component._listImportFees(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.roomFeeImport.moreCondition) {
                    vc.component.roomFeeImport.moreCondition = false;
                } else {
                    vc.component.roomFeeImport.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
