/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailComplaintInfo: {
                complaints: [],
                ownerId: '',
                name: '',
                currentAppUserId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailComplaint', 'switch', function (_data) {
                $that.ownerDetailComplaintInfo.ownerId = _data.ownerId;
                $that._loadOwnerDetailComplaintData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailComplaint', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailComplaintData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('ownerDetailComplaint', 'listAuditAppUserBindingOwner', function (_param) {
                vc.component._loadOwnerDetailComplaintData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailComplaint', 'auditMessage', function (_auditInfo) {
                vc.component._auditAppUserBindingOwner(_auditInfo);
            });
        },
        methods: {
            _loadOwnerDetailComplaintData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        memberId: $that.ownerDetailComplaintInfo.ownerId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/complaint.listComplaints',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailComplaintInfo.complaints = _roomInfo.complaints;
                        vc.emit('ownerDetailComplaint', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyOwnerDetailComplaint: function () {
                $that._loadOwnerDetailComplaintData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            openRunWorkflowImage: function (_complaint) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _complaint.complaintId
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            vc.toast(_workflowManageInfo.msg);
                            return;
                        }
                        vc.emit('viewImage', 'showImage', {
                            url: 'data:image/png;base64,' + _workflowManageInfo.data
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openComplaintDetailModel: function (_complaint) {
                vc.emit('complaintDetail', 'openComplaintDetailModal', _complaint);
            },
            
            // 流程图
            _openRunWorkflowImage: function (_complaint) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _complaint.complaintId
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            vc.toast(_workflowManageInfo.msg);
                            return;
                        }
                        vc.emit('viewImage', 'showImage', {
                            url: 'data:image/png;base64,' + _workflowManageInfo.data
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);