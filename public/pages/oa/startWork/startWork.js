/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            startTypeInfo: {
                startTypes: [],
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
            $that._listStartTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('startType', 'listStartType', function (_param) {
                $that._listStartTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listStartTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listStartTypes: function (_page, _rows) {
                $that.startTypeInfo.conditions.page = _page;
                $that.startTypeInfo.conditions.row = _rows;
                var param = {
                    params: $that.startTypeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/startType.listStartType',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.startTypeInfo.total = _json.total;
                        $that.startTypeInfo.records = _json.records;
                        $that.startTypeInfo.startTypes = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.startTypeInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddStartTypeModal: function () {
                vc.emit('addStartType', 'openAddStartTypeModal', {});
            },
            _openEditStartTypeModel: function (_startType) {
                vc.emit('editStartType', 'openEditStartTypeModal', _startType);
            },
            _openDeleteStartTypeModel: function (_startType) {
                vc.emit('deleteStartType', 'openDeleteStartTypeModal', _startType);
            },
            _queryStartTypeMethod: function () {
                $that._listStartTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },

        }
    });
})(window.vc);
