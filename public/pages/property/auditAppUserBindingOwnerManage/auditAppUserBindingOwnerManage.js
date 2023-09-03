/**
 入驻小区
 **/
(function(vc) {
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
        _initMethod: function() {
            $that._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('auditAppUserBindingOwnerManage', 'listAuditAppUserBindingOwner', function(_param) {
                $that._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('auditAppUserBindingOwnerManage', 'auditMessage', function(_auditInfo) {
                $that._auditAppUserBindingOwner(_auditInfo);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAuditAppUserBindingOwners(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAuditAppUserBindingOwners: function(_page, _rows) {
                $that.auditAppUserBindingOwnerManageInfo.conditions.page = _page;
                $that.auditAppUserBindingOwnerManageInfo.conditions.row = _rows;
                $that.auditAppUserBindingOwnerManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.auditAppUserBindingOwnerManageInfo.conditions
                };
                param.params.appUserName = param.params.appUserName.trim();
                param.params.link = param.params.link.trim();
                param.params.idCard = param.params.idCard.trim();
                param.params.memberId = param.params.memberId.trim();
                //发送get请求
                vc.http.apiGet('/owner.listAuditAppUserBindingOwners',
                    param,
                    function(json, res) {
                        let _auditAppUserBindingOwnerManageInfo = JSON.parse(json);
                        $that.auditAppUserBindingOwnerManageInfo.total = _auditAppUserBindingOwnerManageInfo.total;
                        $that.auditAppUserBindingOwnerManageInfo.records = _auditAppUserBindingOwnerManageInfo.records;
                        $that.auditAppUserBindingOwnerManageInfo.auditAppUserBindingOwners = _auditAppUserBindingOwnerManageInfo.auditAppUserBindingOwners;
                        vc.emit('pagination', 'init', {
                            total: $that.auditAppUserBindingOwnerManageInfo.records,
                            dataCount: $that.auditAppUserBindingOwnerManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditAppUserBindingOwnerModel: function(_auditAppUserBindingOwner) {
                $that.auditAppUserBindingOwnerManageInfo.currentAppUserId = _auditAppUserBindingOwner.appUserId;
                vc.emit('audit', 'openAuditModal', {});
            },
            _auditAppUserBindingOwner: function(_auditInfo) {
                _auditInfo.communityId = vc.getCurrentCommunity().communityId;
                _auditInfo.appUserId = $that.auditAppUserBindingOwnerManageInfo.currentAppUserId;
                //发送get请求
                vc.http.apiPost('/owner.updateAppUserBindingOwner',
                    JSON.stringify(_auditInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        vc.toast("处理成功");
                        $that._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            _moreCondition: function() {
                if ($that.auditAppUserBindingOwnerManageInfo.moreCondition) {
                    $that.auditAppUserBindingOwnerManageInfo.moreCondition = false;
                } else {
                    $that.auditAppUserBindingOwnerManageInfo.moreCondition = true;
                }
            },
            //查询
            _queryAuditAppUserBindingOwnerMethod: function() {
                $that._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAuditAppUserBindingOwnerMethod: function() {
                $that.auditAppUserBindingOwnerManageInfo.conditions.appUserName = "";
                $that.auditAppUserBindingOwnerManageInfo.conditions.idCard = "";
                $that.auditAppUserBindingOwnerManageInfo.conditions.state = "";
                $that.auditAppUserBindingOwnerManageInfo.conditions.link = "";
                $that.auditAppUserBindingOwnerManageInfo.conditions.memberId = "";
                $that._listAuditAppUserBindingOwners(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _deleteAppUserBindingOwnerModel: function(_auditAppUserBindingOwner) {
                vc.emit('deleteAppUserBindingOwner', 'openDeleteAppUserBindingOwnerModal', _auditAppUserBindingOwner);
            },
            _resetUserPwdModel: function(_staff) {
                vc.emit('resetStaffPwd', 'openResetStaffPwd', _staff);
            }
        }
    });
})(window.vc);