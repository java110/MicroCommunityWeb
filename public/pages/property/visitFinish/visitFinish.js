/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            visitFinishInfo: {
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
                $that.visitFinishInfo.audit = '1';
                vc.component.visitFinishInfo.conditions.page = _page;
                vc.component.visitFinishInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.visitFinishInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/visit.queryFinishVisit',
                    param,
                    function(json, res) {
                        var _visitFinishInfo = JSON.parse(json);
                        vc.component.visitFinishInfo.total = _visitFinishInfo.total;
                        vc.component.visitFinishInfo.records = _visitFinishInfo.records;
                        vc.component.visitFinishInfo.finishs = _visitFinishInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.visitFinishInfo.records,
                            dataCount: vc.component.visitFinishInfo.total,
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
                vc.jumpToPage("/#/pages/property/visitDetail?vId=" + _item.vId + "&flowId=" + _item.flowId);
            }
        }
    });
})(window.vc);