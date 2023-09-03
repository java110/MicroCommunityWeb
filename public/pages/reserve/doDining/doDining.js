/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            doDiningInfo: {
                reserveDinings: [],
                orders: [],
                total: 0,
                records: 1,
                goodsId: '',
                moreCondition: false,
                qrCode: '',
                conditions: {
                    goodsName: '',
                    startDate: '',
                    endDate: '',
                    ownerName: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            $that._listReserveDinings(1, 200);
            $that._initDate();

            document.getElementById("qrCode").focus();
            // 心跳一直 保持 选中
            setInterval(function() {
                document.getElementById("qrCode").focus();
            }, 5000);
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
                    $that.doDiningInfo.conditions.startDate = _value;
                });
                vc.initDate('endDate', function(_value) {
                    $that.doDiningInfo.conditions.endDate = _value;
                });
            },
            _listReserveDinings: function(_page, _rows) {
                $that.doDiningInfo.conditions.page = _page;
                $that.doDiningInfo.conditions.row = _rows;
                let param = {
                    params: $that.doDiningInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reserve.listReserveGoods',
                    param,
                    function(json, res) {
                        let _doDiningInfo = JSON.parse(json);
                        $that.doDiningInfo.reserveDinings = _doDiningInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _chooseDining: function(_dining) {
                $that.doDiningInfo.goodsId = _dining.goodsId;
                document.getElementById("qrCode").focus();
            },
            _doDining: function() {
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    goodsId: $that.doDiningInfo.goodsId,
                    qrCode: $that.doDiningInfo.qrCode
                }

                vc.http.apiPost(
                    '/reserveOrder.doDining',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _data = JSON.parse(json);
                        $that.doDiningInfo.qrCode = '';
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                            vc.speckText(_data.msg);
                            return;
                        }
                        $that._listReserveConfirms(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                        $that.doDiningInfo.qrCode = '';
                    }
                );
            },
            _listReserveConfirms: function(_page, _rows) {
                $that.doDiningInfo.conditions.page = _page;
                $that.doDiningInfo.conditions.row = _rows;
                let param = {
                    params: $that.doDiningInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerDining',
                    param,
                    function(json, res) {
                        let _doDiningInfo = JSON.parse(json);
                        $that.doDiningInfo.total = _doDiningInfo.total;
                        $that.doDiningInfo.records = _doDiningInfo.records;
                        $that.doDiningInfo.orders = _doDiningInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.doDiningInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryData: function() {
                $that._listReserveConfirms(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _exportExcel: function() {
                //vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeSummary&' + vc.objToGetParam($that.reportFeeSummaryInfo.conditions));
                $that.doDiningInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that.doDiningInfo.conditions.pagePath = 'doDining';
                let param = {
                    params: $that.doDiningInfo.conditions
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