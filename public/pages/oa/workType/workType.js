/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workTypeInfo: {
                workTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                wtId: '',
                conditions: {
                    wtId: '',
                    typeName: '',
                    timeout: '',
                }
            }
        },
        _initMethod: function () {
            $that._listWorkTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('workType', 'listWorkType', function (_param) {
                $that._listWorkTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listWorkTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listWorkTypes: function (_page, _rows) {
                $that.workTypeInfo.conditions.page = _page;
                $that.workTypeInfo.conditions.row = _rows;
                var param = {
                    params: $that.workTypeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/workType.listWorkType',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.workTypeInfo.total = _json.total;
                        $that.workTypeInfo.records = _json.records;
                        $that.workTypeInfo.workTypes = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.workTypeInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddWorkTypeModal: function () {
                vc.emit('addWorkType', 'openAddWorkTypeModal', {});
            },
            _openEditWorkTypeModel: function (_workType) {
                vc.emit('editWorkType', 'openEditWorkTypeModal', _workType);
            },
            _openDeleteWorkTypeModel: function (_workType) {
                vc.emit('deleteWorkType', 'openDeleteWorkTypeModal', _workType);
            },
            _queryWorkTypeMethod: function () {
                $that._listWorkTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },

        }
    });
})(window.vc);
