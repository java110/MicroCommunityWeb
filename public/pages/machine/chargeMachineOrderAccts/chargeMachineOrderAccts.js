/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            chargeMachineOrderAcctsInfo: {
                chargeMachineOrderAcctss: [],
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
                    state: '',
                }
            }
        },
        _initMethod: function() {
            $that.chargeMachineOrderAcctsInfo.conditions.orderId = vc.getParam('orderId');
            vc.component._listChargeMachineOrderAcctss(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('chargeMachineOrderAccts', 'listChargeMachineOrderAccts', function(_param) {
                vc.component._listChargeMachineOrderAcctss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listChargeMachineOrderAcctss(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listChargeMachineOrderAcctss: function(_page, _rows) {

                vc.component.chargeMachineOrderAcctsInfo.conditions.page = _page;
                vc.component.chargeMachineOrderAcctsInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.chargeMachineOrderAcctsInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/chargeMachine.listChargeMachineOrderAcct',
                    param,
                    function(json, res) {
                        var _chargeMachineOrderAcctsInfo = JSON.parse(json);
                        vc.component.chargeMachineOrderAcctsInfo.total = _chargeMachineOrderAcctsInfo.total;
                        vc.component.chargeMachineOrderAcctsInfo.records = _chargeMachineOrderAcctsInfo.records;
                        vc.component.chargeMachineOrderAcctsInfo.chargeMachineOrderAcctss = _chargeMachineOrderAcctsInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chargeMachineOrderAcctsInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryChargeMachineOrderAcctsMethod: function() {
                vc.component._listChargeMachineOrderAcctss(DEFAULT_PAGE, DEFAULT_ROWS);

            },

        }
    });
})(window.vc);