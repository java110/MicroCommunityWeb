/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            businessTableHisManageInfo: {
                businessTableHiss: [],
                total: 0,
                records: 1,
                moreCondition: false,
                hisId: '',
                conditions: {
                    action: '',
                    actionObj: '',
                    businessTypeCd: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listBusinessTableHiss(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('businessTableHisManage', 'listBusinessTableHis', function (_param) {
                vc.component._listBusinessTableHiss(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listBusinessTableHiss(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listBusinessTableHiss: function (_page, _rows) {
                vc.component.businessTableHisManageInfo.conditions.page = _page;
                vc.component.businessTableHisManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.businessTableHisManageInfo.conditions
                };
                param.params.actionObj = param.params.actionObj.trim();
                param.params.businessTypeCd = param.params.businessTypeCd.trim();
                //发送get请求
                vc.http.apiGet('/businessTableHis.listBusinessTableHis',
                    param,
                    function (json, res) {
                        var _businessTableHisManageInfo = JSON.parse(json);
                        vc.component.businessTableHisManageInfo.total = _businessTableHisManageInfo.total;
                        vc.component.businessTableHisManageInfo.records = _businessTableHisManageInfo.records;
                        vc.component.businessTableHisManageInfo.businessTableHiss = _businessTableHisManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.businessTableHisManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddBusinessTableHisModal: function () {
                vc.emit('addBusinessTableHis', 'openAddBusinessTableHisModal', {});
            },
            _openEditBusinessTableHisModel: function (_businessTableHis) {
                vc.emit('editBusinessTableHis', 'openEditBusinessTableHisModal', _businessTableHis);
            },
            _openDeleteBusinessTableHisModel: function (_businessTableHis) {
                vc.emit('deleteBusinessTableHis', 'openDeleteBusinessTableHisModal', _businessTableHis);
            },
            _queryBusinessTableHisMethod: function () {
                vc.component._listBusinessTableHiss(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetBusinessTableHisMethod: function () {
                vc.component.businessTableHisManageInfo.conditions.action = "";
                vc.component.businessTableHisManageInfo.conditions.actionObj = "";
                vc.component.businessTableHisManageInfo.conditions.businessTypeCd = "";
                vc.component._listBusinessTableHiss(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.businessTableHisManageInfo.moreCondition) {
                    vc.component.businessTableHisManageInfo.moreCondition = false;
                } else {
                    vc.component.businessTableHisManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
