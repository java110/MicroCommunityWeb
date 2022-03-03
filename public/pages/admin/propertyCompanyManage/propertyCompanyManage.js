/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            propertyCompanyManageInfo: {
                propertyCompanys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                storeId: '',
                conditions: {
                    storeId: '',
                    name: '',
                    tel: '',
                }
            }
        },
        _initMethod: function() {
            vc.component._listPropertyCompanys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('propertyCompanyManage', 'listPropertyCompany', function(_param) {
                vc.component._listPropertyCompanys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listPropertyCompanys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listPropertyCompanys: function(_page, _rows) {

                vc.component.propertyCompanyManageInfo.conditions.page = _page;
                vc.component.propertyCompanyManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.propertyCompanyManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/property.listProperty',
                    param,
                    function(json, res) {
                        var _propertyCompanyManageInfo = JSON.parse(json);
                        vc.component.propertyCompanyManageInfo.total = _propertyCompanyManageInfo.total;
                        vc.component.propertyCompanyManageInfo.records = _propertyCompanyManageInfo.records;
                        vc.component.propertyCompanyManageInfo.propertyCompanys = _propertyCompanyManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.propertyCompanyManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPropertyCompanyModal: function() {
                vc.emit('addPropertyCompany', 'openAddPropertyCompanyModal', {});
            },
            _openEditPropertyCompanyModel: function(_propertyCompany) {
                vc.emit('editPropertyCompany', 'openEditPropertyCompanyModal', _propertyCompany);
            },
            _openDeletePropertyCompanyModel: function(_propertyCompany) {
                vc.emit('deletePropertyCompany', 'openDeletePropertyCompanyModal', _propertyCompany);
            },
            _queryPropertyCompanyMethod: function() {
                vc.component._listPropertyCompanys(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.propertyCompanyManageInfo.moreCondition) {
                    vc.component.propertyCompanyManageInfo.moreCondition = false;
                } else {
                    vc.component.propertyCompanyManageInfo.moreCondition = true;
                }
            },
            _openManageCommunity: function(_propertyCompany) {
                vc.jumpToPage('/#/pages/common/propertyCommunity?storeId=' + _propertyCompany.storeId);
            },
            _openAdminLoginPropertyModel: function(_listProperty) {
                $that._listPropertyCompanyManager(_listProperty)

            },
            _openUpdateStoreStateModel: function(_listProperty, state) {
                vc.emit('updateStoreState', 'open', {
                    storeId: _listProperty.storeId,
                    state: state,
                    stateName: state == '48002' ? '限制登录' : '恢复登录'
                })
            },

            _listPropertyCompanyManager: function(_listProperty) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        relCd: '600311000001',
                        storeId: _listProperty.storeId
                    }
                };

                //发送get请求
                vc.http.apiGet('/storeStaff/getPropertyStaffs',
                    param,
                    function(json, res) {
                        var _listPropertyManageInfo = JSON.parse(json);;
                        vc.emit('adminLoginProperty', 'login', {
                            username: _listPropertyManageInfo.data[0].staffName,
                            userId: _listPropertyManageInfo.data[0].staffId,
                            curUserName: vc.getData('/nav/getUserInfo').name
                        })
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _resetStaffPwd: function(_listProperty) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        relCd: '600311000001',
                        storeId: _listProperty.storeId
                    }
                };

                //发送get请求
                vc.http.apiGet('/storeStaff/getPropertyStaffs',
                    param,
                    function(json, res) {
                        var _listPropertyManageInfo = JSON.parse(json);;
                        vc.emit('resetStaffPwd', 'openResetStaffPwd', {
                            username: _listPropertyManageInfo.data[0].staffName,
                            userId: _listPropertyManageInfo.data[0].staffId,
                            curUserName: vc.getData('/nav/getUserInfo').name
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            }

        }
    });
})(window.vc);