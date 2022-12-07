/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditAppUserBindingOwnerManageInfo: {
                auditAppUserBindingOwners: [],
                total: 0,
                records: 1,
                moreCondition: false,
                currentAppUserId: '',
                name: '',
                conditions: {
                    appUserName: '',
                    idCard: '',
                    link: '',
                    state: '',
                    appType: '',
                    appTypeName: '',
                    memberId: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('auditAppUserBindingOwnerManage', 'listAuditAppUserBindingOwner', function (_param) {
                vc.component._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('auditAppUserBindingOwnerManage', 'auditMessage', function (_auditInfo) {
                vc.component._auditAppUserBindingOwner(_auditInfo);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAuditAppUserBindingOwners(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAuditAppUserBindingOwners: function (_page, _rows) {
                vc.component.auditAppUserBindingOwnerManageInfo.conditions.page = _page;
                vc.component.auditAppUserBindingOwnerManageInfo.conditions.row = _rows;
                vc.component.auditAppUserBindingOwnerManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.auditAppUserBindingOwnerManageInfo.conditions
                };
                param.params.appUserName = param.params.appUserName.trim();
                param.params.link = param.params.link.trim();
                param.params.idCard = param.params.idCard.trim();
                param.params.memberId = param.params.memberId.trim();
                //发送get请求
                vc.http.apiGet('/owner.listAuditAppUserBindingOwners',
                    param,
                    function (json, res) {
                        let _auditAppUserBindingOwnerManageInfo = JSON.parse(json);
                        vc.component.auditAppUserBindingOwnerManageInfo.total = _auditAppUserBindingOwnerManageInfo.total;
                        vc.component.auditAppUserBindingOwnerManageInfo.records = _auditAppUserBindingOwnerManageInfo.records;
                        vc.component.auditAppUserBindingOwnerManageInfo.auditAppUserBindingOwners = _auditAppUserBindingOwnerManageInfo.auditAppUserBindingOwners;
                        vc.emit('pagination', 'init', {
                            total: vc.component.auditAppUserBindingOwnerManageInfo.records,
                            dataCount: vc.component.auditAppUserBindingOwnerManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditAppUserBindingOwnerModel: function (_auditAppUserBindingOwner) {
                vc.component.auditAppUserBindingOwnerManageInfo.currentAppUserId = _auditAppUserBindingOwner.appUserId;
                vc.emit('audit', 'openAuditModal', {});
            },
            _auditAppUserBindingOwner: function (_auditInfo) {
                _auditInfo.communityId = vc.getCurrentCommunity().communityId;
                _auditInfo.appUserId = vc.component.auditAppUserBindingOwnerManageInfo.currentAppUserId;
                //发送get请求
                vc.http.apiPost('/owner.updateAppUserBindingOwner',
                    JSON.stringify(_auditInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        vc.toast("处理成功");
                        vc.component._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.auditAppUserBindingOwnerManageInfo.moreCondition) {
                    vc.component.auditAppUserBindingOwnerManageInfo.moreCondition = false;
                } else {
                    vc.component.auditAppUserBindingOwnerManageInfo.moreCondition = true;
                }
            },
            //查询
            _queryAuditAppUserBindingOwnerMethod: function () {
                vc.component._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAuditAppUserBindingOwnerMethod: function () {
                vc.component.auditAppUserBindingOwnerManageInfo.conditions.appUserName = "";
                vc.component.auditAppUserBindingOwnerManageInfo.conditions.idCard = "";
                vc.component.auditAppUserBindingOwnerManageInfo.conditions.state = "";
                vc.component.auditAppUserBindingOwnerManageInfo.conditions.link = "";
                vc.component.auditAppUserBindingOwnerManageInfo.conditions.memberId = "";
                vc.component._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
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