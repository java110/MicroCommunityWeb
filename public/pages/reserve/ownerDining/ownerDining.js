/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDiningInfo: {
                orders: [],
                total: 0,
                records: 1,
                goodsId: '',
                moreCondition: false,
                qrCode: '',
                conditions: {
                    name: '',
                    link: '',
                    startDate: '',
                    endDate: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            $that._initDate();
            vc.component._listReserveConfirms(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listReserveConfirms(_currentPage, DEFAULT_ROWS);
            });

        },
        methods: {
            _initDate: function() {
                vc.initDate('startDate', function(_value) {
                    $that.ownerDiningInfo.conditions.startDate = _value;
                });
                vc.initDate('endDate', function(_value) {
                    $that.ownerDiningInfo.conditions.endDate = _value;
                });
                let _data = new Date();
                let _month = _data.getMonth() + 1;
                let _newDate = "";
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + "-01";
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + "-01";
                }
                $that.ownerDiningInfo.conditions.startDate = _newDate;
                _data.setMonth(_data.getMonth() + 1);
                _month = _data.getMonth() + 1;
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + "-01";
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + "-01";
                }
                $that.ownerDiningInfo.conditions.endDate = _newDate;
            },
            _listReserveConfirms: function(_page, _rows) {
                $that.ownerDiningInfo.conditions.page = _page;
                $that.ownerDiningInfo.conditions.row = _rows;
                let param = {
                    params: $that.ownerDiningInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerReserveGoods',
                    param,
                    function(json, res) {
                        let _ownerDiningInfo = JSON.parse(json);
                        $that.ownerDiningInfo.total = _ownerDiningInfo.total;
                        $that.ownerDiningInfo.records = _ownerDiningInfo.records;
                        $that.ownerDiningInfo.orders = _ownerDiningInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.ownerDiningInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryData: function() {
                vc.component._listReserveConfirms(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _exportExcel: function() {
                //vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeSummary&' + vc.objToGetParam($that.reportFeeSummaryInfo.conditions));
                $that.ownerDiningInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.ownerDiningInfo.conditions.pagePath = 'ownerDining';
                let param = {
                    params: $that.ownerDiningInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });
})(window.vc);