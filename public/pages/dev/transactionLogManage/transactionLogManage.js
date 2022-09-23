/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            transactionLogManageInfo: {
                logs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                typeCds: [],
                conditions: {
                    appId: '',
                    serviceCode: '',
                    transactionId: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listLogs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('transactionLogManage', 'listLog', function (_param) {
                vc.component._listLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listLogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listLogs: function (_page, _rows) {
                vc.component.transactionLogManageInfo.conditions.page = _page;
                vc.component.transactionLogManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.transactionLogManageInfo.conditions
                };
                param.params.appId = param.params.appId.trim();
                param.params.serviceCode = param.params.serviceCode.trim();
                param.params.transactionId = param.params.transactionId.trim();
                //发送get请求
                vc.http.apiGet('/transactionLog/queryTransactionLog',
                    param,
                    function (json, res) {
                        var _transactionLogManageInfo = JSON.parse(json);
                        vc.component.transactionLogManageInfo.total = _transactionLogManageInfo.total;
                        vc.component.transactionLogManageInfo.records = _transactionLogManageInfo.records;
                        vc.component.transactionLogManageInfo.logs = _transactionLogManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.transactionLogManageInfo.records,
                            dataCount: vc.component.transactionLogManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            viewLogMessage: function (_transactionLog) {
                vc.emit('transactionLogMessage', 'openModal', _transactionLog);
            },
            //查询
            _queryLogMethod: function () {
                vc.component._listLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetLogMethod: function () {
                vc.component.transactionLogManageInfo.conditions.serviceCode = "";
                vc.component.transactionLogManageInfo.conditions.appId = "";
                vc.component.transactionLogManageInfo.conditions.transactionId = "";
                vc.component._listLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.transactionLogManageInfo.moreCondition) {
                    vc.component.transactionLogManageInfo.moreCondition = false;
                } else {
                    vc.component.transactionLogManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
