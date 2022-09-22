/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chainInoutOrderInfo: {
                inoutOrders: [],
                total: 0,
                records: 1,
                moreCondition: false,
                csId: '',
                css: [],
                conditions: {
                    personName: '',
                    orderId: '',
                    csId: '',

                }
            }
        },
        _initMethod: function() {
            vc.component._listChainInoutOrder(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listChainSuppliers();
        },
        _initEvent: function() {

            vc.on('chainInoutOrder', 'listChainSupplier', function(_param) {
                vc.component._listChainInoutOrder(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listChainInoutOrder(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listChainInoutOrder: function(_page, _rows) {

                vc.component.chainInoutOrderInfo.conditions.page = _page;
                vc.component.chainInoutOrderInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.chainInoutOrderInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/chainInoutOrder.listChainInoutOrder',
                    param,
                    function(json, res) {
                        let _chainInoutOrderInfo = JSON.parse(json);
                        vc.component.chainInoutOrderInfo.total = _chainInoutOrderInfo.total;
                        vc.component.chainInoutOrderInfo.records = _chainInoutOrderInfo.records;
                        vc.component.chainInoutOrderInfo.inoutOrders = _chainInoutOrderInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chainInoutOrderInfo.records,
                            dataCount: vc.component.chainInoutOrderInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryChainInoutOrderMethod: function() {
                vc.component._listChainInoutOrder(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.chainInoutOrderInfo.moreCondition) {
                    vc.component.chainInoutOrderInfo.moreCondition = false;
                } else {
                    vc.component.chainInoutOrderInfo.moreCondition = true;
                }
            },
            _toOrderDetail: function(_order) {

            },
            _listChainSuppliers: function(_page, _rows) {


                let param = {
                    params: {
                        page: 1,
                        row: 50
                    }
                };

                //发送get请求
                vc.http.apiGet('chainSupplier.listChainSupplier',
                    param,
                    function(json, res) {
                        let _chainSupplierManageInfo = JSON.parse(json);
                        vc.component.chainInoutOrderInfo.css = _chainSupplierManageInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);