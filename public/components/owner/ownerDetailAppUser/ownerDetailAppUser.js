/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailAppUserInfo: {
                appUsers: [],
                ownerId: '',
                name: '',
                currentAppUserId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailAppUser', 'switch', function (_data) {
                $that.ownerDetailAppUserInfo.ownerId = _data.ownerId;
                $that._loadOwnerDetailAppUserData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailAppUser', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailAppUserData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('ownerDetailAppUser', 'listAuditAppUserBindingOwner', function (_param) {
                vc.component._loadOwnerDetailAppUserData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailAppUser', 'auditMessage', function (_auditInfo) {
                vc.component._auditAppUserBindingOwner(_auditInfo);
            });
        },
        methods: {
            _loadOwnerDetailAppUserData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        memberId: $that.ownerDetailAppUserInfo.ownerId,
                        name: $that.ownerDetailAppUserInfo.name,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/owner.listAuditAppUserBindingOwners',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailAppUserInfo.appUsers = _roomInfo.auditAppUserBindingOwners;
                        vc.emit('ownerDetailAppUser', 'paginationPlus', 'init', {
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
            _qureyOwnerDetailAppUser: function () {
                $that._loadOwnerDetailAppUserData(DEFAULT_PAGE, DEFAULT_ROWS);
            },

            _openAuditAppUserBindingOwnerModel: function (_auditAppUserBindingOwner) {
                vc.component.ownerDetailAppUserInfo.currentAppUserId = _auditAppUserBindingOwner.appUserId;
                vc.emit('audit', 'openAuditModal', {});
            },
            _auditAppUserBindingOwner: function (_auditInfo) {
                _auditInfo.communityId = vc.getCurrentCommunity().communityId;
                _auditInfo.appUserId = vc.component.ownerDetailAppUserInfo.currentAppUserId;
                //发送get请求
                vc.http.apiPost('/owner.updateAppUserBindingOwner',
                    JSON.stringify(_auditInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        vc.toast("处理成功");
                        vc.component._loadOwnerDetailAppUserData(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            _deleteAppUserBindingOwnerModel: function (_auditAppUserBindingOwner) {
                vc.emit('deleteAppUserBindingOwner', 'openDeleteAppUserBindingOwnerModal', _auditAppUserBindingOwner);
            },
            _resetUserPwdModel: function (_staff) {
                vc.emit('resetStaffPwd', 'openResetStaffPwd', _staff);
            }

        }
    });
})(window.vc);