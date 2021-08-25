(function (vc) {
    vc.extends({
        data: {
            newOaWorkflowDetailInfo: {
                id: '',
                flowId: '',
                pools: {},
                formJson: [],
                comments: [],
            }
        },
        _initMethod: function () {
            let id = vc.getParam('id');
            if (!vc.notNull(id)) {
                vc.toast('非法操作');
                vc.
                    return;
            }
            $that.newOaWorkflowDetailInfo.id = id;
            $that.newOaWorkflowDetailInfo.flowId = vc.getParam('flowId');
            $that._listOaWorkflowDetails();
            $that._loadComments();
        },
        _initEvent: function () {
        },
        methods: {
            _listOaWorkFlowDetailForm: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        flowId: $that.newOaWorkflowDetailInfo.flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowForm',
                    param,
                    function (json, res) {
                        let _newOaWorkflowFormInfo = JSON.parse(json);
                        $that.newOaWorkflowDetailInfo.formJson = JSON.parse(_newOaWorkflowFormInfo.data[0].formJson).components;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOaWorkflowDetails: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        id: $that.newOaWorkflowDetailInfo.id,
                        flowId: $that.newOaWorkflowDetailInfo.flowId
                    }
                };

                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowFormData',
                    param,
                    function (json, res) {
                        var _newOaWorkflowDetailInfo = JSON.parse(json);
                        vc.component.newOaWorkflowDetailInfo.pools = _newOaWorkflowDetailInfo.data[0];
                        $that._listOaWorkFlowDetailForm();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadComments: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: $that.newOaWorkflowDetailInfo.id
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listWorkflowAuditInfo',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            return;
                        }
                        $that.newOaWorkflowDetailInfo.comments = _workflowManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack()
            },
            _getNewOaWorkflowDetailState: function (_pool) {
                /**
                 * 1001 申请 1002 待审核 1003 退回 1004 委托 1005 办结
                 */
                if (!_pool.hasOwnProperty('state')) {
                    return "未知";
                }

                switch (_pool.state) {
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