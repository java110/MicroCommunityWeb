/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerSettledApplyFinishInfo: {
                finishs: [],
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
            vc.component._listFinishOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listFinishOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFinishOrders: function(_page, _rows) {
                $that.ownerSettledApplyFinishInfo.audit = '1';
                vc.component.ownerSettledApplyFinishInfo.conditions.page = _page;
                vc.component.ownerSettledApplyFinishInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.ownerSettledApplyFinishInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/ownerSettled.queryFinishOwnerSettled',
                    param,
                    function(json, res) {
                        var _ownerSettledApplyFinishInfo = JSON.parse(json);
                        vc.component.ownerSettledApplyFinishInfo.total = _ownerSettledApplyFinishInfo.total;
                        vc.component.ownerSettledApplyFinishInfo.records = _ownerSettledApplyFinishInfo.records;
                        vc.component.ownerSettledApplyFinishInfo.finishs = _ownerSettledApplyFinishInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.ownerSettledApplyFinishInfo.records,
                            dataCount: vc.component.ownerSettledApplyFinishInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryFinishOrdersMethod: function() {
                vc.component._listFinishOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetail: function(_item) {
                vc.jumpToPage("/#/pages/owner/ownerSettledApplyDetail?applyId=" + _item.applyId + "&flowId=" + _item.flowId);
            },
            viewOwnerSettledRooms:function(_item){
                vc.emit('viewOwnerSettledRooms', 'openChooseItemReleaseRes',_item);
            },
        }
    });
})(window.vc);