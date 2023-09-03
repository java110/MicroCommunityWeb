/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            transactionOutLogInfo: {
                logs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                logTypes: [{
                    name: '物联网',
                    value: 'IOT'
                }, {
                    name: '微信',
                    value: 'WECHAT'
                }, {
                    name: '微信支付',
                    value: 'WECHAT_PAY'
                }, {
                    name: 'OSS',
                    value: 'OSS'
                }, {
                    name: '短信',
                    value: 'SMS'
                }],
                conditions: {
                    startTime: '',
                    endTime: '',
                    logType: 'IOT'
                }
            }
        },
        _initMethod: function() {
            vc.initDateTime('startTime', function(_value) {
                $that.transactionOutLogInfo.conditions.startTime = _value;
            });
            vc.initDateTime('endTime', function(_value) {
                $that.transactionOutLogInfo.conditions.endTime = _value;
            })
            $that._listLogs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('transactionOutLog', 'listLog', function(_param) {
                $that._listLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listLogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listLogs: function(_page, _rows) {
                $that.transactionOutLogInfo.conditions.page = _page;
                $that.transactionOutLogInfo.conditions.row = _rows;
                let param = {
                    params: $that.transactionOutLogInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/log.queryTransactionOutLog',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.transactionOutLogInfo.total = _json.total;
                        $that.transactionOutLogInfo.records = _json.records;
                        $that.transactionOutLogInfo.logs = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.transactionOutLogInfo.records,
                            dataCount: $that.transactionOutLogInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            swatchLogType: function(_transactionLog) {
                $that.transactionOutLogInfo.conditions.logType = _transactionLog.value;
                $that._listLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询
            _queryLogMethod: function() {
                $that._listLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);