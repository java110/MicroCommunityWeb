/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            applyRoomDiscountTypeManageInfo: {
                applyRoomDiscountTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                applyType: '',
                conditions: {
                    typeName: '',
                    applyType: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listApplyRoomDiscountTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('applyRoomDiscountTypeManage', 'listApplyRoomDiscountType', function (_param) {
                vc.component._listApplyRoomDiscountTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listApplyRoomDiscountTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listApplyRoomDiscountTypes: function (_page, _rows) {
                vc.component.applyRoomDiscountTypeManageInfo.conditions.page = _page;
                vc.component.applyRoomDiscountTypeManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.applyRoomDiscountTypeManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/applyRoomDiscount/queryApplyRoomDiscountType',
                    param,
                    function (json, res) {
                        var _applyRoomDiscountTypeManageInfo = JSON.parse(json);
                        vc.component.applyRoomDiscountTypeManageInfo.total = _applyRoomDiscountTypeManageInfo.total;
                        vc.component.applyRoomDiscountTypeManageInfo.records = _applyRoomDiscountTypeManageInfo.records;
                        vc.component.applyRoomDiscountTypeManageInfo.applyRoomDiscountTypes = _applyRoomDiscountTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.applyRoomDiscountTypeManageInfo.records,
                            dataCount: vc.component.applyRoomDiscountTypeManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddApplyRoomDiscountTypeModal: function () {
                vc.emit('addApplyRoomDiscountType', 'openAddApplyRoomDiscountTypeModal', {});
            },
            _openEditApplyRoomDiscountTypeModel: function (_applyRoomDiscountType) {
                vc.emit('editApplyRoomDiscountType', 'openEditApplyRoomDiscountTypeModal', _applyRoomDiscountType);
            },
            _openDeleteApplyRoomDiscountTypeModel: function (_applyRoomDiscountType) {
                vc.emit('deleteApplyRoomDiscountType', 'openDeleteApplyRoomDiscountTypeModal', _applyRoomDiscountType);
            },
            //查询
            _queryApplyRoomDiscountTypeMethod: function () {
                vc.component._listApplyRoomDiscountTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetApplyRoomDiscountTypeMethod: function () {
                vc.component.applyRoomDiscountTypeManageInfo.conditions.typeName = "";
                vc.component.applyRoomDiscountTypeManageInfo.conditions.applyType = "";
                vc.component._listApplyRoomDiscountTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.applyRoomDiscountTypeManageInfo.moreCondition) {
                    vc.component.applyRoomDiscountTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.applyRoomDiscountTypeManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
