/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            couponPropertyUserManageInfo: {
                couponPropertyUsers: [],
                order: {
                    remark: '',
                    userName: '',
                    createTime: '',
                    tel: '',
                    couponName: '',
                    value: '',
                    toTypeName: '',
                },
                total: 0,
                records: 1,
                moreCondition: false,
                couponId: '',
                conditions: {
                    couponId: '',
                    couponName: '',
                    validityDay: '',
                    userName: '',
                    tel: '',
                    toType: '',
                    state: '',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listCouponPropertyUsers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('couponPropertyUserManage', 'listCouponPropertyUser', function (_param) {
                vc.component._listCouponPropertyUsers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCouponPropertyUsers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCouponPropertyUsers: function (_page, _rows) {

                vc.component.couponPropertyUserManageInfo.conditions.page = _page;
                vc.component.couponPropertyUserManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.couponPropertyUserManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/couponProperty.listCouponPropertyUserDetail',
                    param,
                    function (json, res) {
                        var _couponPropertyUserManageInfo = JSON.parse(json);
                        vc.component.couponPropertyUserManageInfo.total = _couponPropertyUserManageInfo.total;
                        vc.component.couponPropertyUserManageInfo.records = _couponPropertyUserManageInfo.records;
                        vc.component.couponPropertyUserManageInfo.couponPropertyUsers = _couponPropertyUserManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.couponPropertyUserManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
           
            _queryCouponPropertyUserMethod: function () {
                vc.component._listCouponPropertyUsers(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.couponPropertyUserManageInfo.moreCondition) {
                    vc.component.couponPropertyUserManageInfo.moreCondition = false;
                } else {
                    vc.component.couponPropertyUserManageInfo.moreCondition = true;
                }
            },
            _confirmCouponPropertyUser: function(_page, _rows) {

                let _couponId = $that.couponPropertyUserManageInfo.couponId;
                if (!_couponId) {
                    vc.toast('请扫码');
                    return;
                }

                let _data = {
                    couponQrcode: _couponId,
                    communityId: vc.getCurrentCommunity().communityId,
                    giftCount:1
                }

                vc.http.apiPost(
                    '/couponProperty.writeOffCouponPropertyUser',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        $that.couponPropertyUserManageInfo.couponId = '';
                        let _json = JSON.parse(json);
                        if (_json.code != 0) {
                            vc.toast(_json.msg);
                            return;
                        }
                        $that._listCouponPropertyUsers(1, 10);
                        vc.toast("核销成功");
                        if (!_json.data || _json.data.length < 1) {
                            return;
                        }
                        vc.copyObject(_json.data[0], $that.couponPropertyUserManageInfo.order);

                        if (!$that.couponPropertyUserManageInfo.order.remark) {
                            $that.couponPropertyUserManageInfo.order.remark = "核销成功";
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        $that.couponPropertyUserManageInfo.couponId = '';
                        vc.toast(errInfo);
                    });
            },


        }
    });
})(window.vc);
