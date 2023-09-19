//订单查询
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 20;
    vc.extends({
        data: {
            orderManageInfo: {
                orderDataVos: [],
                apps:[],
                total: 0,
                records: 1,
                orderDetail: false,
                conditions: {
                    oId: '',
                    extTransactionId: '',
                    orderTypeCd: '',
                    appId: '',
                    startTime:'',
                    endTime:'',
                    staffNameLike:'',
                    bId:'',
                    businessTypeNameLike:''
                }
            }
        },
        _initMethod: function() {
            $that._listOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadApps();

            vc.initDateTime('startTime',function(_value){
                $that.orderManageInfo.conditions.startTime = _value;
            });
            vc.initDateTime('endTime',function(_value){
                $that.orderManageInfo.conditions.endTime = _value;
            })
        },
        _initEvent: function() {
            vc.on('orderManage', 'goBack', function(_param) {
                $that.orderManageInfo.orderDetail = false;
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOrders: function(_page, _rows) {
                $that.orderManageInfo.conditions.page = _page;
                $that.orderManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.orderManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/corders.listCorders',
                    param,
                    function(json, res) {
                        var _orderManageInfo = JSON.parse(json);
                        $that.orderManageInfo.total = _orderManageInfo.total;
                        $that.orderManageInfo.records = _orderManageInfo.records;
                        $that.orderManageInfo.orderDataVos = _orderManageInfo.data;

                        vc.emit('pagination', 'init', {
                            total: $that.orderManageInfo.records,
                            dataCount: $that.orderManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryOrdersMethod: function() {
                $that._listOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openOrderDetailModel: function(_order) {
                $that.orderManageInfo.orderDetail = true;
                vc.emit('orderDetailManage', 'listOrderDetails', _order.cBusiness);
            },
            _loadApps:function(){
                let param = {
                    params: {
                        page:1,
                        row:50
                    }
                };
                $that.orderManageInfo.apps = [{
                    appId: '',
                    name: '全部应用'
                }];
              
                //发送get请求
                vc.http.apiGet('/app.listPublicApps',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        _json.apps.forEach(item => {
                            $that.orderManageInfo.apps.push(item);
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            swatchApp:function(_app){
                $that.orderManageInfo.conditions.appId = _app.appId;
                $that._listOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _showUnitemLog:function(_order){
                vc.emit('viewUnItemLog', 'openLog',_order);
            }
        }
    });
})(window.vc);