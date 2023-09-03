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
                vc.http.apiGet('/couponProperty.listCouponPropertyUser',
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
            _openAddCouponPropertyUserModal: function () {
                vc.emit('addCouponPropertyUser', 'openAddCouponPropertyUserModal', {});
            },
            _openEditCouponPropertyUserModel: function (_couponPropertyUser) {
                vc.emit('editCouponPropertyUser', 'openEditCouponPropertyUserModal', _couponPropertyUser);
            },
            _openDeleteCouponPropertyUserModel: function (_couponPropertyUser) {
                vc.emit('deleteCouponPropertyUser', 'openDeleteCouponPropertyUserModal', _couponPropertyUser);
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
            }


        }
    });
})(window.vc);
