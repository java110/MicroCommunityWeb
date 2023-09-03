/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerSettledApplyUndoInfo: {
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
        _initMethod: function() {
            vc.component._listUndoOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listUndoOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listUndoOrders: function(_page, _rows) {
                $that.ownerSettledApplyUndoInfo.audit = '1';
                vc.component.ownerSettledApplyUndoInfo.conditions.page = _page;
                vc.component.ownerSettledApplyUndoInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.ownerSettledApplyUndoInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/ownerSettled.queryUndoOwnerSettled',
                    param,
                    function(json, res) {
                        var _ownerSettledApplyUndoInfo = JSON.parse(json);
                        vc.component.ownerSettledApplyUndoInfo.total = _ownerSettledApplyUndoInfo.total;
                        vc.component.ownerSettledApplyUndoInfo.records = _ownerSettledApplyUndoInfo.records;
                        vc.component.ownerSettledApplyUndoInfo.undos = _ownerSettledApplyUndoInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.ownerSettledApplyUndoInfo.records,
                            dataCount: vc.component.ownerSettledApplyUndoInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryUndoOrdersMethod: function() {
                vc.component._listUndoOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetail: function(_item) {
                vc.jumpToPage("/#/pages/owner/ownerSettledApplyDetail?applyId=" + _item.applyId + "&flowId=" + _item.flowId);
            },
            _openAuditUndoDetail: function(_undo) {
                vc.jumpToPage("/#/pages/owner/ownerSettledApplyDetail?applyId=" + _undo.applyId +
                    "&flowId=" + _undo.flowId +
                    "&action=Audit" +
                    "&taskId=" + _undo.taskId);
            },
            viewOwnerSettledRooms:function(_item){
                vc.emit('viewOwnerSettledRooms', 'openChooseItemReleaseRes',_item);
            },
        }
    });
})(window.vc);