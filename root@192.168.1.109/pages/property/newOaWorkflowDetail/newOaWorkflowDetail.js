(function(vc) {
    vc.extends({
        data: {
            newOaWorkflowDetailInfo: {
                id: '',
                flowId: '',
                pools: {},
                formJson: [],
                comments: [],
                action: '',
                audit: {
                    auditCode: '1100',
                    auditMessage: '',
                    staffId: '',
                    staffName: '',
                    taskId: ''
                },
                imgData: '',
                nextAudit: {},
                files: []
            }
        },
        _initMethod: function() {
            let id = vc.getParam('id');
            if (!vc.notNull(id)) {
                vc.toast('非法操作');
                return;
            }
            $that.newOaWorkflowDetailInfo.id = id;
            $that.newOaWorkflowDetailInfo.flowId = vc.getParam('flowId');
            $that.newOaWorkflowDetailInfo.action = vc.getParam('action');
            $that.newOaWorkflowDetailInfo.audit.taskId = vc.getParam('taskId');
            $that._listOaWorkflowDetails();
            $that._loadComments();
            if ($that.newOaWorkflowDetailInfo.action) {
                $that._loadNextAuditPerson();
            }
            $that._openNewOaWorkflowDetailImg();
        },
        _initEvent: function() {},
        methods: {
            _listOaWorkFlowDetailForm: function() {
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
                    function(json, res) {
                        let _newOaWorkflowFormInfo = JSON.parse(json);
                        $that.newOaWorkflowDetailInfo.formJson = JSON.parse(_newOaWorkflowFormInfo.data[0].formJson).components;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOaWorkflowDetails: function(_page, _rows) {
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
                    function(json, res) {
                        var _newOaWorkflowDetailInfo = JSON.parse(json);
                        vc.component.newOaWorkflowDetailInfo.pools = _newOaWorkflowDetailInfo.data[0];
                        $that.newOaWorkflowDetailInfo.files = _newOaWorkflowDetailInfo.data[0].files;
                        $that._listOaWorkFlowDetailForm();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadComments: function() {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        id: $that.newOaWorkflowDetailInfo.id,
                        flowId: $that.newOaWorkflowDetailInfo.flowId,
                        page: 1,
                        row: 10
                    }
                };
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowUser',
                    param,
                    function(json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            return;
                        }
                        $that.newOaWorkflowDetailInfo.comments = _workflowManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function() {
                vc.goBack()
            },
            chooseStaff: function() {
                vc.emit('selectStaff', 'openStaff', $that.newOaWorkflowDetailInfo.audit);
            },
            _auditSubmit: function() {
                let _audit = $that.newOaWorkflowDetailInfo.audit;
                _audit.flowId = $that.newOaWorkflowDetailInfo.flowId;
                _audit.id = $that.newOaWorkflowDetailInfo.id;
                /**
                 * assigness 
                 *  -1 表示 下一个节点为 结束节点
                 *  -2 表示 需要指定依稀处理人
                 *  其他表示 下一指定人ID
                 * 
                 */
                if ($that.newOaWorkflowDetailInfo.nextAudit.assignee != '-2') {
                    _audit.staffId = $that.newOaWorkflowDetailInfo.nextAudit.assignee;
                }
                if (!_audit.auditCode) {
                    vc.toast('请选择状态');
                    return;
                }
                if (!_audit.auditMessage) {
                    vc.toast('请填写说明');
                    return;
                }
                if (_audit.auditCode != '1200' && _audit.auditCode != '1400' && !_audit.staffId) {
                    vc.toast('请选择下一节点处理人');
                    return;
                }

                vc.http.apiPost(
                    '/oaWorkflow/auditOaWorkflow',
                    JSON.stringify(_audit), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            $that._goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadNextAuditPerson: function() {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        taskId: $that.newOaWorkflowDetailInfo.audit.taskId,
                        flowId: $that.newOaWorkflowDetailInfo.flowId,
                        id: $that.newOaWorkflowDetailInfo.id
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow/getNextTask',
                    param,
                    function(json, res) {
                        let _nextAudit = JSON.parse(json);
                        if (_nextAudit.code != '0') {
                            return;
                        }
                        $that.newOaWorkflowDetailInfo.nextAudit = _nextAudit.data[0];
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getNewOaWorkflowDetailState: function(_pool) {
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
                        return "转单";
                    case '1005':
                        return "办结";
                }

                return "未知"
            },
            _openNewOaWorkflowDetailImg: function() { //展示流程图
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: $that.newOaWorkflowDetailInfo.id
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function(json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            //vc.toast(_workflowManageInfo.msg);
                            return;
                        }
                        $that.newOaWorkflowDetailInfo.imgData = 'data:image/png;base64,' + _workflowManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);