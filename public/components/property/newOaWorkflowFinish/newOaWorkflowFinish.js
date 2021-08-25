/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            newOaWorkflowFinishInfo: {
                finishs: [],
                total: 0,
                records: 1,
                formJson: [],
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
            vc.on('newOaWorkflowFinish', 'witch', function (_value) {
                $that.newOaWorkflowFinishInfo.conditions.flowId = _value.flowId;
                vc.initDateTime('finishStartTime', function (_value) {
                    $that.newOaWorkflowFinishInfo.conditions.startTime = _value;
                });
                vc.initDateTime('finishEndTime', function (_value) {
                    $that.newOaWorkflowFinishInfo.conditions.endTime = _value;
                });
                $that._listOaWorkFlowFinishForm();
                vc.component._listOaWorkflowFinishs(DEFAULT_PAGE, DEFAULT_ROWS);
            })
            vc.on('newOaWorkflowFinish','paginationPlus', 'page_event', function (_currentPage) {
                vc.component._listOaWorkflowFinishs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOaWorkFlowFinishForm: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        flowId: $that.newOaWorkflowFinishInfo.conditions.flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowForm',
                    param,
                    function (json, res) {
                        let _newOaWorkflowFormInfo = JSON.parse(json);
                        $that.newOaWorkflowFinishInfo.formJson = JSON.parse(_newOaWorkflowFormInfo.data[0].formJson).components;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOaWorkflowFinishs: function (_page, _rows) {
                vc.component.newOaWorkflowFinishInfo.conditions.page = _page;
                vc.component.newOaWorkflowFinishInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.newOaWorkflowFinishInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowUserHisTaskFormData',
                    param,
                    function (json, res) {
                        var _newOaWorkflowFinishInfo = JSON.parse(json);
                        vc.component.newOaWorkflowFinishInfo.total = _newOaWorkflowFinishInfo.total;
                        vc.component.newOaWorkflowFinishInfo.records = _newOaWorkflowFinishInfo.records;
                        vc.component.newOaWorkflowFinishInfo.finishs = _newOaWorkflowFinishInfo.data;
                        vc.emit('newOaWorkflowFinish','paginationPlus', 'init', {
                            total: vc.component.newOaWorkflowFinishInfo.records,
                            dataCount: vc.component.newOaWorkflowFinishInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openNewOaWorkflowFinishDetail: function (_notice) {
                vc.jumpToPage("/admin.html#/pages/common/noticeDetail?noticeId=" + _notice.noticeId);
            },
            _queryOaWorkflowFinishMethod: function () {
                vc.component._listOaWorkflowFinishs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getNewOaWorkflowFinishState: function (_finish) {
                /**
                 * 1001 申请 1002 待审核 1003 退回 1004 委托 1005 办结
                 */
                if (!_finish.hasOwnProperty('state')) {
                    return "未知";
                }

                switch (_finish.state) {
                    case '1001':
                        return "申请";
                    case '1002':
                        return "待审核";
                    case '1003':
                        return "退回";
                    case '1004':
                        return "委托";
                    case '1005':
                        return "办结";
                }

                return "未知"
            }
        }
    });
})(window.vc);