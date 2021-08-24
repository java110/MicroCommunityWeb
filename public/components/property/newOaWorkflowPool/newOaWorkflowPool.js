/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            newOaWorkflowPoolInfo: {
                pools: [],
                total: 0,
                records: 1,
                conditions: {
                    createUserName: '',
                    startTime: '',
                    endTime: '',
                    flowId: ''
                }
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('newOaWorkflowPool', 'witch', function (_value) {
                $that.newOaWorkflowFormInfo.conditions.flowId = _value.flowId;
                vc.initDateTime('poolStartTime', function (_value) {
                    $that.newOaWorkflowPoolInfo.conditions.startTime = _value;
                });
                vc.initDateTime('poolEndTime', function (_value) {
                    $that.newOaWorkflowPoolInfo.conditions.endTime = _value;
                });
                vc.component._listOaWorkflowPools(DEFAULT_PAGE, DEFAULT_ROWS);
            })
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOaWorkflowPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOaWorkflowPools: function (_page, _rows) {
                vc.component.newOaWorkflowPoolInfo.conditions.page = _page;
                vc.component.newOaWorkflowPoolInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.newOaWorkflowPoolInfo.conditions
                };

                //发送get请求
                vc.http.get('newOaWorkflowPool',
                    'list',
                    param,
                    function (json, res) {
                        var _newOaWorkflowPoolInfo = JSON.parse(json);
                        vc.component.newOaWorkflowPoolInfo.total = _newOaWorkflowPoolInfo.total;
                        vc.component.newOaWorkflowPoolInfo.records = _newOaWorkflowPoolInfo.records;
                        vc.component.newOaWorkflowPoolInfo.notices = _newOaWorkflowPoolInfo.notices;
                        vc.emit('pagination', 'init', {
                            total: vc.component.newOaWorkflowPoolInfo.records,
                            dataCount: vc.component.newOaWorkflowPoolInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openNewOaWorkflowPoolDetail: function (_notice) {
                vc.jumpToPage("/admin.html#/pages/common/noticeDetail?noticeId=" + _notice.noticeId);
            },
            _queryOaWorkflowPoolMethod: function () {
                vc.component._listOaWorkflowPools(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);