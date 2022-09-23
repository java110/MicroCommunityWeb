/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            oaWorkflowManageInfo: {
                oaWorkflows: [],
                total: 0,
                records: 1,
                moreCondition: false,
                flowTypes: [],
                states: [],
                conditions: {
                    flowId: '',
                    flowName: '',
                    state: '',
                    flowType: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('oa_workflow', "flow_type", function (_data) {
                vc.component.oaWorkflowManageInfo.flowTypes = _data;
            });
            vc.getDict('oa_workflow', "state", function (_data) {
                vc.component.oaWorkflowManageInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('oaWorkflowManage', 'listOaWorkflow', function (_param) {
                vc.component._listOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOaWorkflows(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOaWorkflows: function (_page, _rows) {
                vc.component.oaWorkflowManageInfo.conditions.page = _page;
                vc.component.oaWorkflowManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.oaWorkflowManageInfo.conditions
                };
                param.params.flowId = param.params.flowId.trim();
                param.params.flowName = param.params.flowName.trim();
                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflow',
                    param,
                    function (json, res) {
                        var _oaWorkflowManageInfo = JSON.parse(json);
                        vc.component.oaWorkflowManageInfo.total = _oaWorkflowManageInfo.total;
                        vc.component.oaWorkflowManageInfo.records = _oaWorkflowManageInfo.records;
                        vc.component.oaWorkflowManageInfo.oaWorkflows = _oaWorkflowManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.oaWorkflowManageInfo.records,
                            dataCount: vc.component.oaWorkflowManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddOaWorkflowModal: function () {
                vc.emit('addOaWorkflow', 'openAddOaWorkflowModal', {});
            },
            _openEditOaWorkflowModel: function (_oaWorkflow) {
                vc.emit('editOaWorkflow', 'openEditOaWorkflowModal', _oaWorkflow);
            },
            _openDeleteOaWorkflowModel: function (_oaWorkflow) {
                vc.emit('deleteOaWorkflow', 'openDeleteOaWorkflowModal', _oaWorkflow);
            },
            //查询
            _queryOaWorkflowMethod: function () {
                vc.component._listOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOaWorkflowMethod: function () {
                vc.component.oaWorkflowManageInfo.conditions.flowId = "";
                vc.component.oaWorkflowManageInfo.conditions.flowName = "";
                vc.component.oaWorkflowManageInfo.conditions.flowType = "";
                vc.component.oaWorkflowManageInfo.conditions.state = "";
                vc.component._listOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.oaWorkflowManageInfo.moreCondition) {
                    vc.component.oaWorkflowManageInfo.moreCondition = false;
                } else {
                    vc.component.oaWorkflowManageInfo.moreCondition = true;
                }
            },
            _openWorkflowEditorApp: function (_oaWorkflow) {
                window.open('/bpmnjs/index.html?flowId=' + _oaWorkflow.flowId + "&modelId=" + _oaWorkflow.modelId);
            },
            _openWorkflowForm: function (_oaWorkflow) {
                window.open('/formjs/editor.html?flowId=' + _oaWorkflow.flowId + "&modelId=" + _oaWorkflow.modelId);
            },
            _openDeployWorkflow: function (_oaWorkflow) {
                let _param = {
                    modelId: _oaWorkflow.modelId
                };
                //发送get请求
                vc.http.apiPost('/workflow/deployModel',
                    JSON.stringify(_param),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg)
                        vc.emit('oaWorkflowManage', 'listOaWorkflow', {});
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);
