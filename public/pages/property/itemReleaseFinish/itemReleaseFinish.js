/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            itemReleaseFinishInfo: {
                finishs: [],
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
            vc.component._listUndoOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listUndoOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listUndoOrders: function(_page, _rows) {
                $that.itemReleaseFinishInfo.audit = '1';
                vc.component.itemReleaseFinishInfo.conditions.page = _page;
                vc.component.itemReleaseFinishInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.itemReleaseFinishInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/itemRelease.queryFinishItemRelease',
                    param,
                    function(json, res) {
                        var _itemReleaseFinishInfo = JSON.parse(json);
                        vc.component.itemReleaseFinishInfo.total = _itemReleaseFinishInfo.total;
                        vc.component.itemReleaseFinishInfo.records = _itemReleaseFinishInfo.records;
                        vc.component.itemReleaseFinishInfo.finishs = _itemReleaseFinishInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.itemReleaseFinishInfo.records,
                            dataCount: vc.component.itemReleaseFinishInfo.total,
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
                vc.jumpToPage("/#/pages/property/itemReleaseDetail?irId=" + _item.irId + "&flowId=" + _item.flowId);
            },
            viewResName:function(_item){
                vc.emit('viewItemReleaseRes','openChooseItemReleaseRes',_item);
            },
        }
    });
})(window.vc);