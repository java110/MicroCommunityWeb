/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            shopAuditManageInfo: {
                shopAudits: [],
                total: 0,
                records: 1,
                moreCondition: false,
                componentShow: 'shopAuditManage',
                shopId: '',
                conditions: {
                    auditId: '',
                    storeId: '',
                    returnLink: '',
                    returnPerson: '',
                    shopName: '',
                    state: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listShopAudits(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('shopAuditManage', 'listShopAudit', function (_param) {
                $that.shopAuditManageInfo.componentShow ='shopAuditManage';
                vc.component._listShopAudits(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listShopAudits(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listShopAudits: function (_page, _rows) {

                vc.component.shopAuditManageInfo.conditions.page = _page;
                vc.component.shopAuditManageInfo.conditions.row = _rows;
                vc.component.shopAuditManageInfo.conditions.caId = vc.getCurrentCommunity().caId;
                var param = {
                    params: vc.component.shopAuditManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/shopAudit/queryShopAudit',
                    param,
                    function (json, res) {
                        var _shopAuditManageInfo = JSON.parse(json);
                        vc.component.shopAuditManageInfo.total = _shopAuditManageInfo.total;
                        vc.component.shopAuditManageInfo.records = _shopAuditManageInfo.records;
                        vc.component.shopAuditManageInfo.shopAudits = _shopAuditManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.shopAuditManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOpenShopModel: function (_shopAudit) {
                $that.shopAuditManageInfo.componentShow = 'viewShopAuditInfo';
                vc.emit('viewShopAuditInfo', 'chooseShopAudit', _shopAudit);
            },
            _openAddShopAuditModal: function () {
                vc.emit('addShopAudit', 'openAddShopAuditModal', {});
            },
            _auditState: function (_state) {
                if(_state == "001"){
                    return "待审核"
                }
                if(_state == "002"){
                    return "审核通过"
                }
                if(_state == "003"){
                    return "审核不通过"
                }
            },
            _openEditShopAuditModel: function (_shopAudit) {
                vc.emit('editShopAudit', 'openEditShopAuditModal', _shopAudit);
            },
            _openDeleteShopAuditModel: function (_shopAudit) {
                vc.emit('deleteShopAudit', 'openDeleteShopAuditModal', _shopAudit);
            },
            _queryShopAuditMethod: function () {
                vc.component._listShopAudits(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.shopAuditManageInfo.moreCondition) {
                    vc.component.shopAuditManageInfo.moreCondition = false;
                } else {
                    vc.component.shopAuditManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
