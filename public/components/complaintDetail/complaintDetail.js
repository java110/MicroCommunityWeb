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
                $that.complaintDetailInfo.currentUserName = _params.currentUserName == '' ? '无':_params.currentUserName;
                $that.complaintDetailInfo.currentUserTel = _params.currentUserTel == '' ? '无':_params.currentUserTel;
                $that.complaintDetailInfo.currentUserId = _params.currentUserId == '' ? '无':_params.currentUserId;
                vc.component.complaintDetailInfo.communityId = vc.getCurrentCommunity().communityId;
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

                }
            }
        }
    });

})(window.vc, window.vc.component);
