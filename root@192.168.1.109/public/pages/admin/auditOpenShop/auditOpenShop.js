/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditOpenShopInfo: {
                shops: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    AuditOpenShopsId: '',
                    userName: '',
                    auditLink: '',
                },
                orderInfo: {},
                procure: false
            }
        },
        _initMethod: function() {
            vc.component._listAuditOpenShops(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('myAuditOpenShops', 'listAuditOpenShops', function(_param) {
                vc.component._listAuditOpenShops(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listAuditOpenShops(_currentPage, DEFAULT_ROWS);
            });

            vc.on('auditOpenShop', 'notifyAudit', function(_auditInfo) {
                vc.component._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOpenShops: function(_page, _rows) {

                vc.component.auditOpenShopInfo.conditions.page = _page;
                vc.component.auditOpenShopInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.auditOpenShopInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/shop/queryNeedAuditShop',
                    param,
                    function(json, res) {
                        var _auditOpenShopInfo = JSON.parse(json);
                        vc.component.auditOpenShopInfo.total = _auditOpenShopInfo.total;
                        vc.component.auditOpenShopInfo.records = _auditOpenShopInfo.records;
                        vc.component.auditOpenShopInfo.shops = _auditOpenShopInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.auditOpenShopInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOpenShopModel: function(_auditOrder) {
                vc.component.auditOpenShopInfo.orderInfo = _auditOrder;
                if (confirm("该店铺尚未缴纳保证金，请确认是否继续该操作")==true){
                    vc.emit('audit', 'openAuditModal', {});
                }else{ 
                    return false; 
                }
            },
            _queryAuditOpenShopsMethod: function() {
                vc.component._listAuditOpenShops(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailPurchaseApplyModel: function(_purchaseApply) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=" + _purchaseApply.resOrderType);
            },
            //提交审核信息
            _auditOrderInfo: function(_auditInfo) {
                console.log("提交得参数：" + _auditInfo);
                //发送get请求
                _auditInfo.shopId = $that.auditOpenShopInfo.orderInfo.shopId;
                _auditInfo.storeId = $that.auditOpenShopInfo.orderInfo.storeId;
                vc.http.apiPost('/shop/auditShop',
                    JSON.stringify(_auditInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json)
                        if (_json.code != 0) {
                            vc.toast(_json.msg);
                            return;
                        }
                        vc.toast("处理成功");
                        vc.component._listAuditOpenShops(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            }
        }
    });
})(window.vc);