/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceAuditFlowInfo: {
                resourceAuditFlows: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rafId: '',
                conditions: {
                    rafId: '',
                    auditType: '',
                    flowName: ''
                }
            }
        },
        _initMethod: function () {
            $that._listResourceAuditFlows(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('resourceAuditFlow', 'listResourceAuditFlow', function (_param) {
                $that._listResourceAuditFlows(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listResourceAuditFlows(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listResourceAuditFlows: function (_page, _rows) {
                $that.resourceAuditFlowInfo.conditions.page = _page;
                $that.resourceAuditFlowInfo.conditions.row = _rows;
                $that.resourceAuditFlowInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.resourceAuditFlowInfo.conditions
                };
                param.params.flowName = param.params.flowName.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceAuditFlow',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.resourceAuditFlowInfo.total = _json.total;
                        $that.resourceAuditFlowInfo.records = _json.records;
                        $that.resourceAuditFlowInfo.resourceAuditFlows = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.resourceAuditFlowInfo.records,
                            dataCount: $that.resourceAuditFlowInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddResourceAuditFlowModal: function () {
                vc.emit('addResourceAuditFlow', 'openAddResourceAuditFlowModal', {});
            },
            _openEditResourceAuditFlowModel: function (_resourceAuditFlow) {
                vc.emit('editResourceAuditFlow', 'openEditResourceAuditFlowModal', _resourceAuditFlow);
            },
            _openDeleteResourceAuditFlowModel: function (_resourceAuditFlow) {
                vc.emit('deleteResourceAuditFlow', 'openDeleteResourceAuditFlowModal', _resourceAuditFlow);
            },
            //查询
            _queryResourceAuditFlowMethod: function () {
                $that._listResourceAuditFlows(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceAuditFlowMethod: function () {
                vc.component.resourceAuditFlowInfo.conditions.flowName = "";
                vc.component.resourceAuditFlowInfo.conditions.auditType = "";
                $that._listResourceAuditFlows(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.resourceAuditFlowInfo.moreCondition) {
                    $that.resourceAuditFlowInfo.moreCondition = false;
                } else {
                    $that.resourceAuditFlowInfo.moreCondition = true;
                }
            },
            _settingFlow: function (resourceAuditFlow) {
                window.open('/bpmnjs/index.html?flowId=' + resourceAuditFlow.flowId + "&modelId=" + resourceAuditFlow.modelId);
            },
            _openDeployWorkflow: function (resourceAuditFlow) {
                let _param = {
                    modelId: resourceAuditFlow.modelId
                };
                //发送get请求
                vc.http.apiPost('/workflow/deployModel',
                    JSON.stringify(_param), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg)
                        vc.emit('resourceAuditFlow', 'listResourceAuditFlow', {});
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);