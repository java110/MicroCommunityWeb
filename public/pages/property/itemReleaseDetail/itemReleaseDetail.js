(function(vc) {
    vc.extends({
        data: {
            itemReleaseDetailInfo: {
                irId: '',
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
        _initMethod: function() {
            let irId = vc.getParam('irId');
            if (!vc.notNull(irId)) {
                vc.toast('非法操作');
                return;
            }
            $that.itemReleaseDetailInfo.irId = irId;
            $that.itemReleaseDetailInfo.flowId = vc.getParam('flowId');
            $that.itemReleaseDetailInfo.action = vc.getParam('action');
            $that.itemReleaseDetailInfo.audit.taskId = vc.getParam('taskId');
            $that._listOaWorkflowDetails();
            $that._loadItemReleaseRes();
            $that._loadComments();

            $that._openNewOaWorkflowDetailImg();
        },
        _initEvent: function() {},
        methods: {
            _loadItemReleaseRes: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        irId: vc.component.itemReleaseDetailInfo.irId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/itemRelease.listItemReleaseRes',
                    param,
                    function(json) {
                        let _unitInfo = JSON.parse(json);
                        vc.component.itemReleaseDetailInfo.resNames = _unitInfo.data;
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOaWorkflowDetails: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        irId: $that.itemReleaseDetailInfo.irId,
                        flowId: $that.itemReleaseDetailInfo.flowId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/itemRelease.listItemRelease',
                    param,
                    function(json, res) {
                        var _itemReleaseDetailInfo = JSON.parse(json);
                        vc.component.itemReleaseDetailInfo.pools = _itemReleaseDetailInfo.data[0];
                        if ($that.itemReleaseDetailInfo.action) {
                            $that._loadNextAuditPerson();
                        }
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
                        id: $that.itemReleaseDetailInfo.irId,
                        flowId: $that.itemReleaseDetailInfo.flowId,
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
                        $that.itemReleaseDetailInfo.comments = _workflowManageInfo.data;
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
                vc.emit('selectStaff', 'openStaff', $that.itemReleaseDetailInfo.audit);
            },
            _auditSubmit: function() {
                let _audit = $that.itemReleaseDetailInfo.audit;
                _audit.flowId = $that.itemReleaseDetailInfo.flowId;
                _audit.irId = $that.itemReleaseDetailInfo.irId;
                /**
                 * assigness 
                 *  -1 表示 下一个节点为 结束节点
                 *  -2 表示 需要指定依稀处理人
                 *  其他表示 下一指定人ID
                 * 
                 */
                if ($that.itemReleaseDetailInfo.nextAudit.assignee != '-2') {
                    _audit.staffId = $that.itemReleaseDetailInfo.nextAudit.assignee;
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
                    '/itemRelease.auditUndoItemRelease',
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
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        taskId: $that.itemReleaseDetailInfo.audit.taskId,
                        startUserId: $that.itemReleaseDetailInfo.pools.createUserId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow.queryNextDealUser',
                    param,
                    function(json, res) {
                        let _nextAudit = JSON.parse(json);
                        if (_nextAudit.code != '0') {
                            return;
                        }
                        $that.itemReleaseDetailInfo.nextAudit = _nextAudit.data[0];
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openNewOaWorkflowDetailImg: function() { //展示流程图
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: $that.itemReleaseDetailInfo.irId
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
                        $that.itemReleaseDetailInfo.imgData = 'data:image/png;base64,' + _workflowManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);