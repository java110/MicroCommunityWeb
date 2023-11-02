/**
 业主详情页面
 **/
(function (vc) {
    var _fileUrl = '/callComponent/download/getFile/fileByObjId';
    vc.extends({
        data: {
            staffDetailInfo: {
                staffId: '',
                userName: '',
                email: '',
                tel: '',
                sex: '',
                address: '',
                photo: '/img/noPhoto.jpg',
                url: '',
                relCd: '',
                _currentTab: 'staffDetailOrgPrivilege',
                needBack: false
            }
        },
        _initMethod: function () {
            $that.staffDetailInfo.staffId = vc.getParam('staffId');
            if (!vc.notNull($that.staffDetailInfo.staffId)) {
                return;
            }
            vc.component._loadStaffInfo();
            $that.changeTab($that.staffDetailInfo._currentTab);
        },
        _initEvent: function () {
            vc.on('staffDetail', 'listStaffData', function (_info) {
                vc.component._loadStaffInfo();
                $that.changeTab($that.staffDetailInfo._currentTab);
            });
        },
        methods: {
            _loadStaffInfo: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        staffId: $that.staffDetailInfo.staffId
                    }
                };
                //发送get请求
                vc.http.apiGet('/query.staff.infos',
                    param,
                    function (json) {
                        let _staffInfo = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        vc.copyObject(_staffInfo.staffs[0], $that.staffDetailInfo);
                        $that.staffDetailInfo.photo = _fileUrl + "?objId=" +
                            $that.staffDetailInfo.staffId + "&communityId=" + vc.getCurrentCommunity().communityId + "&fileTypeCd=12000&time=" + new Date();
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function (_tab) {
                $that.staffDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    staffId: $that.staffDetailInfo.staffId,
                    staffName: $that.staffDetailInfo.userName,
                    tel: $that.staffDetailInfo.tel,
                })
            },
            _loadStaffPhoto: function () {
                $that.staffDetailInfo.photo = $that.staffDetailInfo.url;
            },
            errorLoadImg: function () {
                vc.component.staffDetailInfo.photo = "/img/noPhoto.jpg";
            },
            _openEditStaffModel: function () {
                $that.staffDetailInfo.name = $that.staffDetailInfo.userName;
                $that.staffDetailInfo.userId = $that.staffDetailInfo.staffId;
                vc.component.$emit('edit_staff_event', $that.staffDetailInfo);
            },
            _resetStaffPwd: function (_staff) {
                vc.emit('resetStaffPwd', 'openResetStaffPwd', $that.staffDetailInfo);
            },
        }
    });
})(window.vc);