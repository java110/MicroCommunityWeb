/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            newOaWorkflowManageInfo: {
                newOaWorkflows: [],
                conditions: {
                    state: 'C'
                }
            }
        },
        _initMethod: function () {
            vc.component._listNewOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('newOaWorkflowManage', 'listNewOaWorkflow', function (_param) {
                vc.component._listNewOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listNewOaWorkflows(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listNewOaWorkflows: function (_page, _rows) {
                vc.component.newOaWorkflowManageInfo.conditions.page = _page;
                vc.component.newOaWorkflowManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.newOaWorkflowManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflow',
                    param,
                    function (json, res) {
                        var _newOaWorkflowManageInfo = JSON.parse(json);
                        $that.newOaWorkflowManageInfo.newOaWorkflows = _newOaWorkflowManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            newFlow: function (_flow) {
                //判断流程是否已部署
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        flowId: _flow.flowId,
                        state: 'C'
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflow',
                    param,
                    function (json, res) {
                        var _oaWorkflowManageInfo = JSON.parse(json);
                        let oaWorkflows = _oaWorkflowManageInfo.data;
                        if (oaWorkflows.length < 1) {
                            vc.toast('流程未部署');
                            return;
                        }
                        vc.jumpToPage('/form.html#/pages/property/newOaWorkflow?flowId=' + _flow.flowId)
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);
