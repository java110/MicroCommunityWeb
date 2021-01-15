/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            businessDatabusManageInfo: {
                businessDatabuss: [],
                total: 0,
                records: 1,
                moreCondition: false,
                databusId: '',
                conditions: {
                    businessTypeCd: '',
                    beanName: '',
                    databusId: '',
                }
            }
        },
        _initMethod: function () {
            vc.component._listBusinessDatabuss(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('businessDatabusManage', 'listBusinessDatabus', function (_param) {
                vc.component._listBusinessDatabuss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listBusinessDatabuss(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listBusinessDatabuss: function (_page, _rows) {
                vc.component.businessDatabusManageInfo.conditions.page = _page;
                vc.component.businessDatabusManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.businessDatabusManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/businessDatabus/queryBusinessDatabus',
                    param,
                    function (json, res) {
                        var _businessDatabusManageInfo = JSON.parse(json);
                        vc.component.businessDatabusManageInfo.total = _businessDatabusManageInfo.total;
                        vc.component.businessDatabusManageInfo.records = _businessDatabusManageInfo.records;
                        vc.component.businessDatabusManageInfo.businessDatabuss = _businessDatabusManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.businessDatabusManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddBusinessDatabusModal: function () {
                vc.emit('addBusinessDatabus', 'openAddBusinessDatabusModal', {});
            },
            _openEditBusinessDatabusModel: function (_businessDatabus) {
                vc.emit('editBusinessDatabus', 'openEditBusinessDatabusModal', _businessDatabus);
            },
            _openDeleteBusinessDatabusModel: function (_businessDatabus) {
                vc.emit('deleteBusinessDatabus', 'openDeleteBusinessDatabusModal', _businessDatabus);
            },
            _queryBusinessDatabusMethod: function () {
                vc.component._listBusinessDatabuss(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.businessDatabusManageInfo.moreCondition) {
                    vc.component.businessDatabusManageInfo.moreCondition = false;
                } else {
                    vc.component.businessDatabusManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
