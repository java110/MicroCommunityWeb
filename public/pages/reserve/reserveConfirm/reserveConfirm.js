/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reserveConfirmInfo: {
                orders: [],
                order: {
                    remark: '',
                    appointmentTime: '',
                    createTime: '',
                    hours: '',
                    spaceName: '',
                    personName: '',
                    personTel: '',
                    quantity:'',
                },
                timeId: '',
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    spaceId: '',
                    personName: '',
                    personTel: '',
                    appointmentTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            $that._listReserveConfirms(1, 10);
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listReserveConfirms(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReserveConfirms: function(_page, _rows) {
                vc.component.reserveConfirmInfo.conditions.page = _page;
                vc.component.reserveConfirmInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.reserveConfirmInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reserveOrder.listReserveGoodsConfirmOrder',
                    param,
                    function(json, res) {
                        let _reserveConfirmInfo = JSON.parse(json);
                        vc.component.reserveConfirmInfo.total = _reserveConfirmInfo.total;
                        vc.component.reserveConfirmInfo.records = _reserveConfirmInfo.records;
                        vc.component.reserveConfirmInfo.orders = _reserveConfirmInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reserveConfirmInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _confirmReserve: function(_page, _rows) {

                let _timeId = $that.reserveConfirmInfo.timeId;
                if (!_timeId) {
                    vc.toast('请扫码');
                    return;
                }

                let _data = {
                    timeId: _timeId,
                    communityId: vc.getCurrentCommunity().communityId
                }

                vc.http.apiPost(
                    '/reserveOrder.saveReserveGoodsConfirmOrder',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        $that.reserveConfirmInfo.timeId = '';
                        let _json = JSON.parse(json);
                        if (_json.code != 0) {
                            vc.toast(_json.msg);
                            return;
                        }
                        $that._listReserveConfirms(1, 10);
                        vc.toast("核销成功");
                        if (!_json.data || _json.data.length < 1) {
                            return;
                        }
                        vc.copyObject(_json.data[0], $that.reserveConfirmInfo.order);

                        if (!$that.reserveConfirmInfo.order.remark) {
                            $that.reserveConfirmInfo.order.remark = "核销成功";
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        $that.reserveConfirmInfo.timeId = '';
                        vc.toast(errInfo);
                    });
            },
            _moreCondition: function() {
                if (vc.component.reserveConfirmInfo.moreCondition) {
                    vc.component.reserveConfirmInfo.moreCondition = false;
                } else {
                    vc.component.reserveConfirmInfo.moreCondition = true;
                }
            },
            _queryReserveConfirmMethod: function() {
                $that._listReserveConfirms(1, 10);
            }
        }
    });
})(window.vc);