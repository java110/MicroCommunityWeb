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
                photos:[]
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
                if(!_params.hasOwnProperty('currentUserName')){
                    $that.complaintDetailInfo.showCurrentUser = false;
                }
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
                    showCurrentUser: true
                }
            }, 
            openFile:function(_photo){
                vc.emit('viewImage','showImage',{
                    url:_photo.url
                });
             }
        }
    });

})(window.vc, window.vc.component);
