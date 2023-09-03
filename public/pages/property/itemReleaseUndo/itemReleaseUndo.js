/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            itemReleaseUndoInfo: {
                undos: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    irId: '',
                    userName: '',
                    auditLink: '',
                },
                orderInfo: '',
                procure: false,
                audit: '1'
            }
        },
        _initMethod: function() {
            $that._listUndoOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listUndoOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listUndoOrders: function(_page, _rows) {
                $that.itemReleaseUndoInfo.audit = '1';
                $that.itemReleaseUndoInfo.conditions.page = _page;
                $that.itemReleaseUndoInfo.conditions.row = _rows;
                var param = {
                    params: $that.itemReleaseUndoInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/itemRelease.queryUndoItemRelease',
                    param,
                    function(json, res) {
                        let _itemReleaseUndoInfo = JSON.parse(json);
                        $that.itemReleaseUndoInfo.total = _itemReleaseUndoInfo.total;
                        $that.itemReleaseUndoInfo.records = _itemReleaseUndoInfo.records;
                        $that.itemReleaseUndoInfo.undos = _itemReleaseUndoInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.itemReleaseUndoInfo.records,
                            dataCount: $that.itemReleaseUndoInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryUndoOrdersMethod: function() {
                $that._listUndoOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetail: function(_item) {
                vc.jumpToPage("/#/pages/property/itemReleaseDetail?irId=" + _item.irId + "&flowId=" + _item.flowId);
            },
            _openAuditUndoDetail: function(_undo) {
                vc.jumpToPage("/#/pages/property/itemReleaseDetail?irId=" + _undo.irId +
                    "&flowId=" + _undo.flowId +
                    "&action=Audit" +
                    "&taskId=" + _undo.taskId);
            },
            viewResName: function(_item) {
                vc.emit('viewItemReleaseRes', 'openChooseItemReleaseRes', _item);
            },
        }
    });
})(window.vc);