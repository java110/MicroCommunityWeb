/**
 审核订单
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            visitUndoInfo: {
                undos: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    vId: '',
                    userName: '',
                    auditLink: '',
                },
                orderInfo: '',
                procure: false,
                audit: '1'
            }
        },
        _initMethod: function () {
            vc.component._listUndoOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listUndoOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listUndoOrders: function (_page, _rows) {
                $that.visitUndoInfo.audit = '1';
                vc.component.visitUndoInfo.conditions.page = _page;
                vc.component.visitUndoInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.visitUndoInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/visit.queryUndoVisit',
                    param,
                    function (json, res) {
                        var _visitUndoInfo = JSON.parse(json);
                        vc.component.visitUndoInfo.total = _visitUndoInfo.total;
                        vc.component.visitUndoInfo.records = _visitUndoInfo.records;
                        vc.component.visitUndoInfo.undos = _visitUndoInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.visitUndoInfo.records,
                            dataCount: vc.component.visitUndoInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryUndoOrdersMethod: function () {
                vc.component._listUndoOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetail: function (_item) {
                vc.jumpToPage("/#/pages/property/visitDetail?vId=" + _item.vId + "&flowId=" + _item.flowId);
            },
            _openAuditUndoDetail: function (_undo) {
                vc.jumpToPage("/#/pages/property/visitDetail?vId=" + _undo.vId +
                    "&flowId=" + _undo.flowId +
                    "&action=Audit" +
                    "&taskId=" + _undo.taskId);
            },
        }
    });
})(window.vc);