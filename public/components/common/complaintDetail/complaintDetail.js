(function (vc, vm) {

    vc.extends({
        data: {
            complaintDetailInfo: {
                complaintId: '',
                typeCd: '',
                complaintName: '',
                tel: '',
                context: '',
                typeCdName: '',
                stateName: '',
                roomName: '',
                currentUserName: '',
                currentUserTel: '',
                currentUserId: '',
                showCurrentUser: true,
                photos: [],
                comments:[]
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('complaintDetail', 'openComplaintDetailModal', function (_params) {
                vc.component.refreshcomplaintDetailInfo();
                $('#complaintDetailModel').modal('show');
                let _roomName = _params.floorNum + '号楼' + _params.unitNum + '单元' + _params.roomNum + '室';
                vc.copyObject(_params, vc.component.complaintDetailInfo);
                $that.complaintDetailInfo.roomName = _roomName;
                if (!_params.hasOwnProperty('currentUserName')) {
                    $that.complaintDetailInfo.showCurrentUser = false;
                }
                $that.complaintDetailInfo.currentUserName = _params.currentUserName == '' ? '无' : _params.currentUserName;
                $that.complaintDetailInfo.currentUserTel = _params.currentUserTel == '' ? '无' : _params.currentUserTel;
                $that.complaintDetailInfo.currentUserId = _params.currentUserId == '' ? '无' : _params.currentUserId;
                vc.component.complaintDetailInfo.communityId = vc.getCurrentCommunity().communityId;
                $that._loadComments();
            });
        },
        methods: {
            refreshcomplaintDetailInfo: function () {
                vc.component.complaintDetailInfo = {
                    complaintId: '',
                    typeCd: '',
                    complaintName: '',
                    tel: '',
                    context: '',
                    typeCdName: '',
                    stateName: '',
                    roomName: '',
                    currentUserName: '',
                    currentUserTel: '',
                    currentUserId: '',
                    showCurrentUser: true,
                    photos: [],
                    comments: []
                }
            },
            openFile: function (_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            },
            _loadComments: function () {

                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: $that.complaintDetailInfo.complaintId
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
                        $that.complaintDetailInfo.comments = _workflowManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc, window.vc.component);
