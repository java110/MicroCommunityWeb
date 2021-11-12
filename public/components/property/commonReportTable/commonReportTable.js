/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            commonReportTableInfo: {
                components: [],
                total: 0,
                records: 1,
                customId: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('commonReportTable', 'witch', function (_value) {
                $that.commonReportTableInfo.customId = _value.customId;
                $that._listReportCustomTableComponent();
            })
            vc.on('commonReportTable', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._listOaWorkflowPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _queryReportTableMethod: function (data) {

            },
            _listReportCustomTableComponent: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        customId: $that.commonReportTableInfo.customId,
                        componentType: '1001'
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportCustomComponentRel.listReportCustomComponentRel',
                    param,
                    function (json, res) {
                        let _reportCustomComponentRelManageInfo = JSON.parse(json);
                        $that.commonReportTableInfo.components = _reportCustomComponentRelManageInfo.data;
                        $that.commonReportTableInfo.components.forEach(item => {
                            $that._listReportCustomTableConditions(item);
                            $that._listReportCustomTableDatas(1, 15, item);
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listReportCustomTableConditions: function (_component) {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        componentId: _component.componentId
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportCustomComponentCondition.listReportCustomComponentCondition',
                    param,
                    function (json, res) {
                        let _componentConditionManageInfo = JSON.parse(json);
                        _component.conditions = _componentConditionManageInfo.data;
                        $that.$forceUpdate();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _listReportCustomTableDatas: function (_page, _row, _component) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        componentId: _component.componentId
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportCustomComponent.listReportCustomComponentData',
                    param,
                    function (json, res) {
                        let _componentDataManageInfo = JSON.parse(json);
                        if (_componentDataManageInfo.code != 0) {
                            vc.toast(_componentDataManageInfo.msg);
                            return;
                        }
                        let _data = _componentDataManageInfo.data;
                        _component.th = _data.th;
                        _component.data = _data.td;
                        vc.emit('commonReportTable', 'pagination', 'init', {
                            total: _componentDataManageInfo.records,
                            currentPage: _page
                        });
                        $that.$forceUpdate();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);