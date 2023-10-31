/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            propertyFeeLedgerInfo: {
                payFees: [],
                total: 0,
                records: 1,
                conditions: {
                    communityId: '',
                    payObjType: '',
                    startTime: '',
                    endTime: '',
                    primeRate: '',
                    userName: ''
                }
            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listpayFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            
            _listPropertyFeeLedger: function (_page, _rows) {
                let param = {
                    params: {
                        page:_page,
                        row:_rows
                    }
                };
                //发送get请求
                vc.http.apiGet('',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.propertyFeeLedgerInfo.total = _json.total;
                        $that.propertyFeeLedgerInfo.records = Math.ceil(_json.total / _rows);
                        $that.propertyFeeLedgerInfo.payFees = _json.data;
                       
                        vc.emit('pagination', 'init', {
                            total: $that.propertyFeeLedgerInfo.records,
                            dataCount: $that.propertyFeeLedgerInfo.total,
                            currentPage: _page,
                            // dataCount: $that.propertyFeeLedgerInfo.total
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryPayFeeMethod: function () {
                $that._listpayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            
            //导出
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportPayFeeManage&' + vc.objToGetParam($that.propertyFeeLedgerInfo.conditions));
            },
        }
    });
})(window.vc);