/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            couponRuleCppsInfo: {
                couponRuleCppss: [],
                total: 0,
                records: 1,
                moreCondition: false,
                textId: '',
                conditions: {
                    crcId: '',
                    ruleId: '',
                    cppId: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    quantity: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listCouponRuleCppss(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('couponRuleCpps', 'switch', function (_data) {
                $that.couponRuleCppsInfo.conditions.ruleId = _data.ruleId;
                $that._listCouponRuleCppss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('couponRuleCppsManage', 'listCouponRuleCpps', function (_param) {
                vc.component._listCouponRuleCppss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('couponRuleCpps', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listCouponRuleCppss(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listCouponRuleCppss: function (_page, _rows) {

                vc.component.couponRuleCppsInfo.conditions.page = _page;
                vc.component.couponRuleCppsInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.couponRuleCppsInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/couponRule.listCouponRuleCpps',
                    param,
                    function (json, res) {
                        var _couponRuleCppsInfo = JSON.parse(json);
                        vc.component.couponRuleCppsInfo.total = _couponRuleCppsInfo.total;
                        vc.component.couponRuleCppsInfo.records = _couponRuleCppsInfo.records;
                        vc.component.couponRuleCppsInfo.couponRuleCppss = _couponRuleCppsInfo.data;
                        vc.emit('couponRuleCpps', 'paginationPlus', 'init', {
                            total: vc.component.couponRuleCppsInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCouponRuleCppsModal: function () {
                vc.emit('addCouponRuleCpps', 'openAddCouponRuleCppsModal', {
                    ruleId:$that.couponRuleCppsInfo.conditions.ruleId,
                });
            },
            _openEditCouponRuleCppsModel: function (_couponRuleCpps) {
                vc.emit('editCouponRuleCpps', 'openEditCouponRuleCppsModal', _couponRuleCpps);
            },
            _openDeleteCouponRuleCppsModel: function (_couponRuleCpps) {
                vc.emit('deleteCouponRuleCpps', 'openDeleteCouponRuleCppsModal', _couponRuleCpps);
            },
            _queryCouponRuleCppsMethod: function () {
                vc.component._listCouponRuleCppss(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.couponRuleCppsInfo.moreCondition) {
                    vc.component.couponRuleCppsInfo.moreCondition = false;
                } else {
                    vc.component.couponRuleCppsInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);