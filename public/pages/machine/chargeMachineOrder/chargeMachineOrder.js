/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chargeMachineOrderInfo: {
                chargeMachineOrders: [],
                total: 0,
                records: 1,
                moreCondition: false,
                orderId: '',
                conditions: {
                    orderId: '',
                    personName: '',
                    personTel: '',
                    machineName: '',
                    portName: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    state: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listChargeMachineOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('chargeMachineOrder', 'listChargeMachineOrder', function (_param) {
                vc.component._listChargeMachineOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listChargeMachineOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listChargeMachineOrders: function (_page, _rows) {
                vc.component.chargeMachineOrderInfo.conditions.page = _page;
                vc.component.chargeMachineOrderInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.chargeMachineOrderInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/chargeMachine.listChargeMachineOrder',
                    param,
                    function (json, res) {
                        var _chargeMachineOrderInfo = JSON.parse(json);
                        vc.component.chargeMachineOrderInfo.total = _chargeMachineOrderInfo.total;
                        vc.component.chargeMachineOrderInfo.records = _chargeMachineOrderInfo.records;
                        vc.component.chargeMachineOrderInfo.chargeMachineOrders = _chargeMachineOrderInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chargeMachineOrderInfo.records,
                            dataCount: vc.component.chargeMachineOrderInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryChargeMachineOrderMethod: function () {
                vc.component._listChargeMachineOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetChargeMachineOrderMethod: function () {
                vc.component.chargeMachineOrderInfo.conditions.orderId = "";
                vc.component.chargeMachineOrderInfo.conditions.personName = "";
                vc.component.chargeMachineOrderInfo.conditions.personTel = "";
                vc.component.chargeMachineOrderInfo.conditions.machineName = "";
                vc.component.chargeMachineOrderInfo.conditions.portName = "";
                vc.component.chargeMachineOrderInfo.conditions.state = "";
                vc.component._listChargeMachineOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewOrderAccts: function (_order) { // 展示扣款明细
                vc.jumpToPage('/#/pages/machine/chargeMachineOrderAccts?orderId=' + _order.orderId)
            },
            _showStopCharge: function (_order) {
                vc.emit('stopChargeMachine', 'openStopChargeMachineModal', _order);
            },
            _viewAccount: function (_order) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        acctId: _order.acctDetailId,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                }
                vc.http.apiGet('/account/queryOwnerAccount',
                    param,
                    function (json, res) {
                        let _acct = JSON.parse(json).data[0];
                        let _data = {
                            "账户": _acct.acctName,
                            "账户类型": _acct.acctTypeName,
                            "账户余额": _acct.amount,
                            "账户编号": _acct.acctId,
                        };
                        vc.emit('viewData', 'openViewDataModal', {
                            title: _acct.acctName + " 详情",
                            data: _data
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.chargeMachineOrderInfo.moreCondition) {
                    vc.component.chargeMachineOrderInfo.moreCondition = false;
                } else {
                    vc.component.chargeMachineOrderInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);