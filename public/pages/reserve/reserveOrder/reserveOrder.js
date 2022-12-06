/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reserveOrderInfo: {
                orders: [],
                spaces: [],
                total: 0,
                records: 1,
                moreCondition: false,
                cspId: '',
                conditions: {
                    goodsId: '',
                    type:'1001',
                    goodsNameLike:'',
                    personName: '',
                    personTel: '',
                    appointmentTime: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    payWay: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listReserveOrderPersons(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('reserveOrder', 'listReserveOrderPerson', function(_param) {
                vc.component._listReserveOrderPersons(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listReserveOrderPersons(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReserveOrderPersons: function(_page, _rows) {

                vc.component.reserveOrderInfo.conditions.page = _page;
                vc.component.reserveOrderInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.reserveOrderInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reserveOrder.listReserveGoodsOrder',
                    param,
                    function(json, res) {
                        var _reserveOrderInfo = JSON.parse(json);
                        vc.component.reserveOrderInfo.total = _reserveOrderInfo.total;
                        vc.component.reserveOrderInfo.records = _reserveOrderInfo.records;
                        vc.component.reserveOrderInfo.orders = _reserveOrderInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reserveOrderInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            
            _openReserveOrderPersonTimeModel: function(_communitySpacePerson) {
                vc.emit('communitySpacePersonTime', 'openEditReserveOrderModal', _communitySpacePerson.times);
            },
            _openDeleteReserveOrderPersonModel: function(_communitySpacePerson) {
                vc.emit('deleteReserveOrderPerson', 'openDeleteReserveOrderPersonModal', _communitySpacePerson);
            },
            _queryReserveOrderPersonMethod: function() {
                vc.component._listReserveOrderPersons(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.reserveOrderInfo.moreCondition) {
                    vc.component.reserveOrderInfo.moreCondition = false;
                } else {
                    vc.component.reserveOrderInfo.moreCondition = true;
                }
            },
            
            _changeType:function(_type){
                $that.reserveOrderInfo.conditions.type = _type;
                $that._listReserveOrderPersons(DEFAULT_PAGE, DEFAULT_ROWS);
            }


        }
    });
})(window.vc);