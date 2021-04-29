//订单查询
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            storeOrderCartReturnManageInfo: {
                orderCarts: [],
                total: 0,
                records: 1,
                orderDetail: false,
                conditions: {
                    cartId: '',
                    state: '',
                    prodName: ''
                },
                curOrderCart: {}
            }
        },
        _initMethod: function () {
            vc.component._listOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('storeOrderCartReturnManage', 'goBack', function (_param) {
                vc.component.storeOrderCartReturnManageInfo.orderDetail = false;
            });
            vc.on('storeOrderCartReturnManage', 'list', function () {
                vc.component._listOrders(DEFAULT_PAGE,DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOrders: function (_page, _rows) {
                vc.component.storeOrderCartReturnManageInfo.conditions.page = _page;
                vc.component.storeOrderCartReturnManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.storeOrderCartReturnManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/storeOrderCartReturn/queryStoreOrderCartReturn',
                    param,
                    function (json, res) {
                        var _storeOrderCartReturnManageInfo = JSON.parse(json);
                        vc.component.storeOrderCartReturnManageInfo.total = _storeOrderCartReturnManageInfo.total;
                        vc.component.storeOrderCartReturnManageInfo.records = _storeOrderCartReturnManageInfo.records;
                        $that.storeOrderCartReturnManageInfo.orderCarts = _storeOrderCartReturnManageInfo.data;

                        let _orderCarts = $that.storeOrderCartReturnManageInfo.orderCarts;

                        _orderCarts.forEach(item => {
                            let _productSpecDetails = item.productSpecDetails;
                            let _specValue = '';
                            _productSpecDetails.forEach(detail => {
                                _specValue += (detail.detailValue + "/");
                            });

                            item.specValue = _specValue;
                        });

                        vc.emit('pagination', 'init', {
                            total: vc.component.storeOrderCartReturnManageInfo.records,
                            dataCount: vc.component.storeOrderCartReturnManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryOrdersMethod: function () {
                vc.component._listOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openOrderDetailModel: function (_order) {
                vc.jumpToPage('/admin.html#/pages/goods/storeOrderCartReturnDetail?orderId=' + _order.orderId + '&cartId=' + _order.cartId);
            },
           
            _closeStoreOrderCartModal: function () {
                $("#storeOrderCartReturnModal").modal('hide');
            },
            _sendOrderCart: function () {
                //发送get请求
                vc.http.apiPost('/storeOrder/sendStoreOrderCart',
                    JSON.stringify($that.storeOrderCartReturnManageInfo.curOrderCart),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let sendResult = JSON.parse(json);
                        if (sendResult.code == 0) {
                            $that._closeStoreOrderCartModal();
                            vc.emit('storeOrderCartReturnManage', 'list',{});
                            vc.toast('发货成功');
                            return;
                        }

                        vc.toast(sendResult.msg);
                        return;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);
