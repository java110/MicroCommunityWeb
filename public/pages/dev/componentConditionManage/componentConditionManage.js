/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            componentConditionManageInfo: {
                componentConditions: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditionId: '',
                componentName: '',
                conditions: {
                    componentId: '',
                    name: '',
                    param: ''
                }
            }
        },
        _initMethod: function () {
            $that.componentConditionManageInfo.conditions.componentId = vc.getParam('componentId');
            $that.componentConditionManageInfo.componentName = vc.getParam('componentName');
            vc.component._listComponentConditions(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('componentConditionManage', 'listComponentCondition', function (_param) {
                vc.component._listComponentConditions(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listComponentConditions(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listComponentConditions: function (_page, _rows) {
                vc.component.componentConditionManageInfo.conditions.page = _page;
                vc.component.componentConditionManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.componentConditionManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportCustomComponentCondition.listReportCustomComponentCondition',
                    param,
                    function (json, res) {
                        var _componentConditionManageInfo = JSON.parse(json);
                        vc.component.componentConditionManageInfo.total = _componentConditionManageInfo.total;
                        vc.component.componentConditionManageInfo.records = _componentConditionManageInfo.records;
                        vc.component.componentConditionManageInfo.componentConditions = _componentConditionManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.componentConditionManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddComponentConditionModal: function () {
                vc.emit('addComponentCondition', 'openAddComponentConditionModal', {
                    componentId: $that.componentConditionManageInfo.conditions.componentId
                });
            },
            _openEditComponentConditionModel: function (_componentCondition) {
                vc.emit('editComponentCondition', 'openEditComponentConditionModal', _componentCondition);
            },
            _openDeleteComponentConditionModel: function (_componentCondition) {
                vc.emit('deleteComponentCondition', 'openDeleteComponentConditionModal', _componentCondition);
            },
            _queryComponentConditionMethod: function () {
                vc.component._listComponentConditions(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _goBack: function () {
                vc.goBack();
            },
            _moreCondition: function () {
                if (vc.component.componentConditionManageInfo.moreCondition) {
                    vc.component.componentConditionManageInfo.moreCondition = false;
                } else {
                    vc.component.componentConditionManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
