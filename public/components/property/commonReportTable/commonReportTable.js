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
                vc.component._listReportCustomTableDatas(_currentPage, DEFAULT_ROWS, $that.commonReportTableInfo.components[0]);
            });
        },
        methods: {
            //查询
            _queryReportTableMethod: function (item) {
                let _condition = {};
                item.conditions.forEach(_item => {
                    _condition[_item.param] = _item.value;
                })
                $that._listReportCustomTableDatas(DEFAULT_PAGE, DEFAULT_ROWS, item, _condition);
                $that._listReportCustomTableFooter(DEFAULT_PAGE, DEFAULT_ROWS, item, _condition);
            },
            //重置
            _resetReportTableMethod: function (item) {
                let _condition = {};
                item.conditions.forEach(_item => {
                    _item.value = "";
                    _condition[_item.param] = _item.value;
                })
                $that._listReportCustomTableDatas(DEFAULT_PAGE, DEFAULT_ROWS, item, _condition);
                $that._listReportCustomTableFooter(DEFAULT_PAGE, DEFAULT_ROWS, item, _condition);
            },
            _listReportCustomTableComponent: function () {
                var param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: DEFAULT_ROWS,
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
                            $that._listReportCustomTableDatas(DEFAULT_PAGE, DEFAULT_ROWS, item);
                            $that._listReportCustomTableFooter(DEFAULT_PAGE, DEFAULT_ROWS, item);
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listReportCustomTableConditions: function (_component) {
                let param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: DEFAULT_ROWS,
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
                        //处理日期类型
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listReportCustomTableDatas: function (_page, _row, _component, _conditions) {
                let _community = vc.getCurrentCommunity();
                let _communityId = '';
                if (_community) {
                    _communityId = _community.communityId
                }
                if (_conditions) {
                    _conditions.page = _page;
                    _conditions.row = _row;
                    _conditions.componentId = _component.componentId;
                    _conditions.communityId = _communityId
                } else {
                    _conditions = {
                        page: _page,
                        row: _row,
                        componentId: _component.componentId,
                        communityId: _communityId
                    }
                }
                let param = {
                    params: _conditions
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
                        vc.emit('commonReportTable', 'paginationPlus', 'init', {
                            total: _componentDataManageInfo.records,
                            dataCount: _componentDataManageInfo.total,
                            currentPage: _page
                        });
                        $that.$forceUpdate();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listReportCustomTableFooter: function (_page, _row, _component, _conditions) {
                let _community = vc.getCurrentCommunity();
                let _communityId = '';
                if (_community) {
                    _communityId = _community.communityId
                }
                if (_conditions) {
                    _conditions.page = _page;
                    _conditions.row = _row;
                    _conditions.componentId = _component.componentId;
                    _conditions.communityId = _communityId
                } else {
                    _conditions = {
                        page: _page,
                        row: _row,
                        componentId: _component.componentId,
                        communityId: _communityId
                    }
                }
                let param = {
                    params: _conditions
                };
                //发送get请求
                vc.http.apiGet('/reportCustomComponent.listReportCustomComponentDataFooter',
                    param,
                    function (json, res) {
                        let _componentDataManageInfo = JSON.parse(json);
                        if (_componentDataManageInfo.code != 0) {
                            return;
                        }
                        let _data = _componentDataManageInfo.data;
                        _component.footer = _data;
                        $that.$forceUpdate();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportReportTableMethod: function (item) {
                let _community = vc.getCurrentCommunity();
                let _communityId = '';
                if (_community) {
                    _communityId = _community.communityId
                }
                let _condition = {};
                item.conditions.forEach(_item => {
                    _condition[_item.param] = _item.value;
                })
                _condition.page = 1;
                _condition.row = 10000;
                _condition.componentId = item.componentId;
                _condition.communityId = _communityId
                let _result = [];
                for (let key in _condition) {
                    let value = _condition[key];

                    if (!value) {
                        continue;
                    }
                    _result.push(key + '=' + value);
                }
                let urlParam = _result.join('&');
                vc.jumpToPage('/callComponent/importAndExportFee/exportCustomReportTableData?' + urlParam)
            },
            _printReportTableMethod: function (_data) {
                vc.saveData('printCommonReportTableData', _data);
                window.open('/print.html#/pages/property/printCommonReportTable');
            }
        }
    });
})(window.vc);