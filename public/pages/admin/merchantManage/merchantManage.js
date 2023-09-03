/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            merchantManageInfo: {
                propertyCompanys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                storeId: '',
                conditions: {
                    storeId: '',
                    name: '',
                    tel: '',
                    storeTypeCd: '800900000005'
                }
            }
        },
        _initMethod: function() {
            $that._listMerchants(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('merchantManage', 'listMerchant', function(_param) {
                $that._listMerchants(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listMerchants(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMerchants: function(_page, _rows) {
                $that.merchantManageInfo.conditions.page = _page;
                $that.merchantManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.merchantManageInfo.conditions
                };
                param.params.storeId = param.params.storeId.trim();
                param.params.name = param.params.name.trim();
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.apiGet('/store.listStores',
                    param,
                    function(json, res) {
                        var _merchantManageInfo = JSON.parse(json);
                        $that.merchantManageInfo.total = _merchantManageInfo.total;
                        $that.merchantManageInfo.records = _merchantManageInfo.records;
                        $that.merchantManageInfo.propertyCompanys = _merchantManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.merchantManageInfo.records,
                            dataCount: $that.merchantManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMerchantModal: function() {
                vc.emit('addMerchantShop', 'openAddMerchantShopModal', {});
            },
            _openEditMerchantModel: function(_propertyCompany) {
                vc.emit('editMerchant', 'openEditMerchantModal', _propertyCompany);
            },
            _openDeleteMerchantModel: function(_propertyCompany) {
                vc.emit('deleteMerchant', 'openDeleteMerchantModal', _propertyCompany);
            },
            //查询
            _queryMerchantMethod: function() {
                $that._listMerchants(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMerchantMethod: function() {
                $that.merchantManageInfo.conditions.storeId = "";
                $that.merchantManageInfo.conditions.name = "";
                $that.merchantManageInfo.conditions.tel = "";
                $that._listMerchants(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toStoreShopPage: function(_store) {
                vc.jumpToPage('/#/pages/admin/merchantShop?storeId=' + _store.storeId)
            },
            _moreCondition: function() {
                if ($that.merchantManageInfo.moreCondition) {
                    $that.merchantManageInfo.moreCondition = false;
                } else {
                    $that.merchantManageInfo.moreCondition = true;
                }
            },
            _openUpdateStoreStateModel: function(_listProperty, state) {
                vc.emit('updateStoreState', 'open', {
                    storeId: _listProperty.storeId,
                    state: state,
                    stateName: state == '48002' ? '限制登录' : '恢复登录'
                })
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
                        var _listPropertyManageInfo = JSON.parse(json);
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