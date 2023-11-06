/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomFeeImportDetailInfo: {
                importFeeDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                    importFeeId: ''
                }
            }
        },
        _initMethod: function () {
            $that.roomFeeImportDetailInfo.conditions.importFeeId = vc.getParam('importFeeId');
            $that._listImportFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listImportFeeDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listImportFeeDetails: function (_page, _rows) {
                vc.component.roomFeeImportDetailInfo.conditions.page = _page;
                vc.component.roomFeeImportDetailInfo.conditions.row = _rows;
                vc.component.roomFeeImportDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.roomFeeImportDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/importFee/queryImportFeeDetail',
                    param,
                    function (json, res) {
                        var _roomFeeImportDetailInfo = JSON.parse(json);
                        vc.component.roomFeeImportDetailInfo.total = _roomFeeImportDetailInfo.total;
                        vc.component.roomFeeImportDetailInfo.records = _roomFeeImportDetailInfo.records;
                        vc.component.roomFeeImportDetailInfo.importFeeDetails = _roomFeeImportDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.roomFeeImportDetailInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openBillDetail: function () {
            },
            _queryFeeDetailMethod: function () {
                vc.component._listImportFeeDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.roomFeeImportDetailInfo.moreCondition) {
                    vc.component.roomFeeImportDetailInfo.moreCondition = false;
                } else {
                    vc.component.roomFeeImportDetailInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
