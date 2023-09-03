(function (vc) {
    vc.extends({
        data: {
            visitDetailInfo: {
                vId: '',
                flowId: '',
                pools: {},
                resNames: [],
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
        _initMethod: function () {
            let vId = vc.getParam('vId');
            if (!vc.notNull(vId)) {
                vc.toast('非法操作');
                return;
            }
            $that.visitDetailInfo.vId = vId;
            $that.visitDetailInfo.flowId = vc.getParam('flowId');
            $that.visitDetailInfo.action = vc.getParam('action');
            $that.visitDetailInfo.audit.taskId = vc.getParam('taskId');
            $that._listOaWorkflowDetails();
            if ($that.visitDetailInfo.flowId) {
                $that._loadComments();
                $that._openNewOaWorkflowDetailImg();
            }
        },
        _initEvent: function () {
        },
        methods: {
            _listOaWorkflowDetails: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        vId: $that.visitDetailInfo.vId,
                        flowId: $that.visitDetailInfo.flowId,
                        communityId: vc.getCurrentCommunity().communityId,
                        channel: 'PC'
                    }
                };
                //发送get请求
                vc.http.apiGet('/visit.listVisits',
                    param,
                    function (json, res) {
                        var _visitDetailInfo = JSON.parse(json);
                        vc.component.visitDetailInfo.pools = _visitDetailInfo.visits[0];
                        if ($that.visitDetailInfo.action) {
                            $that._loadNextAuditPerson();
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadComments: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        id: $that.visitDetailInfo.vId,
                        flowId: $that.visitDetailInfo.flowId,
                        page: 1,
                        row: 10
                    }
                };
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowUser',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            return;
                        }
                        $that.visitDetailInfo.comments = _workflowManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack()
            },
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.visitDetailInfo.audit);
            },
            _auditSubmit: function () {
                let _audit = $that.visitDetailInfo.audit;
                _audit.flowId = $that.visitDetailInfo.flowId;
                _audit.vId = $that.visitDetailInfo.vId;
                _audit.communityId = vc.getCurrentCommunity().communityId;
                /**
                 * assigness
                 *  -1 表示 下一个节点为 结束节点
                 *  -2 表示 需要指定依稀处理人
                 *  其他表示 下一指定人ID
                 *
                 */
                if ($that.visitDetailInfo.nextAudit.assignee != '-2') {
                    _audit.staffId = $that.visitDetailInfo.nextAudit.assignee;
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
                    '/visit.auditUndoVisit',
                    JSON.stringify(_audit), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast(_json.msg);
                            $that._goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadNextAuditPerson: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        taskId: $that.visitDetailInfo.audit.taskId,
                        startUserId: $that.visitDetailInfo.pools.createUserId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow.queryNextDealUser',
                    param,
                    function (json, res) {
                        let _nextAudit = JSON.parse(json);
                        if (_nextAudit.code != '0') {
                            return;
                        }
                        $that.visitDetailInfo.nextAudit = _nextAudit.data[0];
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openNewOaWorkflowDetailImg: function () { //展示流程图
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: $that.visitDetailInfo.vId
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            //vc.toast(_workflowManageInfo.msg);
                            return;
                        }
                        $that.visitDetailInfo.imgData = 'data:image/png;base64,' + _workflowManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            errorLoadImg: function () {
                vc.component.visitDetailInfo.pools.url = "/img/noPhoto.jpg";
            },
        }
    });
})(window.vc);