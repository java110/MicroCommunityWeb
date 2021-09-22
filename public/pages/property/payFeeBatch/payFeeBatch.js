/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeBatchInfo: {
                payFeeBatchs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                payFeeBatchStates: '',
                name: '',
                auditReturnFeeId: '',
                payFeeBatch: '',
                conditions: {
                    communityId: vc.getCurrentCommunity().communityId,
                    state: '',
                    batchId: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listPayFeeBatchs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listPayFeeBatchs(_currentPage, DEFAULT_ROWS);
            });
            vc.on('payFeeBatch', 'notifyAuditInfo', function (_auditInfo) {
                vc.component._auditPayFeeBatchState(_auditInfo);
            });
        },
        methods: {
            _listPayFeeBatchs: function (_page, _rows) {
                vc.component.payFeeBatchInfo.conditions.page = _page;
                vc.component.payFeeBatchInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.payFeeBatchInfo.conditions
                };
                vc.http.apiGet('payFeeBatch.listPayFeeBatch',
                    param,
                    function (json) {
                        var _payFeeBatchInfo = JSON.parse(json);
                        vc.component.payFeeBatchInfo.total = _payFeeBatchInfo.total;
                        vc.component.payFeeBatchInfo.records = _payFeeBatchInfo.records;
                        vc.component.payFeeBatchInfo.payFeeBatchs = _payFeeBatchInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.payFeeBatchInfo.records,
                            dataCount: vc.component.payFeeBatchInfo.total,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryPayFeeBatchMethod: function () {
                vc.component._listPayFeeBatchs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _auditPayFeeBatchState: function (_auditInfo) {
                vc.component.payFeeBatchInfo.payFeeBatch.state = _auditInfo.state;
                //vc.component.payFeeBatchInfo.payFeeBatch.remark = _auditInfo.remark;
                let _payFeeBatch = vc.component.payFeeBatchInfo.payFeeBatch;
                vc.http.apiPost(
                    'payFeeBatch.updatePayFeeBatch',
                    JSON.stringify(_payFeeBatch),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            vc.component._listPayFeeBatchs(DEFAULT_PAGE, DEFAULT_ROWS);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            _openPayFeeBatchAuditModel(_payFee) {
                vc.component.payFeeBatchInfo.payFeeBatch = _payFee;
                vc.emit('audit', 'openAuditModal', {});
            }
        }
    });
})(window.vc);
