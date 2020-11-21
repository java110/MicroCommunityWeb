(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerComplaintInfo: {
                complaints: [],
                ownerId: '',
                roomId: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyOwnerComplaint', 'switch', function (_param) {
                $that.clearSimplifyOwnerComplaintInfo();
                vc.copyObject(_param, $that.simplifyOwnerComplaintInfo)
                $that._listSimplifyOwnerComplaint(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyOwnerComplaint','paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._listSimplifyOwnerComplaint(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyOwnerComplaint: function (_page, _row) {

                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        roomId: $that.simplifyOwnerComplaintInfo.roomId
                    }
                }

                //发送get请求
                vc.http.get('complaintManage',
                    'list',
                    param,
                    function (json, res) {
                        var _complaintManageInfo = JSON.parse(json);
                        vc.component.simplifyOwnerComplaintInfo.total = _complaintManageInfo.total;
                        vc.component.simplifyOwnerComplaintInfo.records = _complaintManageInfo.records;
                        vc.component.simplifyOwnerComplaintInfo.complaints = _complaintManageInfo.complaints;
                        vc.emit('simplifyOwnerComplaint','paginationPlus', 'init', {
                            total: vc.component.simplifyOwnerComplaintInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

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
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openComplaintDetailModel: function (_complaint) {
                vc.emit('complaintDetail', 'openComplaintDetailModal', _complaint);
            },
            clearSimplifyOwnerComplaintInfo: function () {
                $that.simplifyOwnerComplaintInfo = {
                    complaints: [],
                    ownerId: '',
                    roomId: ''
                }
            }

        }

    });
})(window.vc);
