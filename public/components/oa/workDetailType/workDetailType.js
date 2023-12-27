/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workDetailTypeInfo: {
                types: [],
                wtId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('workDetailType', 'switch', function (_data) {
                $that.workDetailTypeInfo.wtId = _data.wtId;
                $that._loadWorkDetailTypeData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('workDetailType', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadWorkDetailTypeData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('workDetailType', 'notify', function (_data) {
                $that._loadWorkDetailTypeData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadWorkDetailTypeData: function (_page, _row) {
                let param = {
                    params: {
                        wtId: $that.workDetailTypeInfo.wtId,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/workType.listWorkType',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workDetailTypeInfo.types = _json.data;
                        vc.emit('workDetailType', 'paginationPlus', 'init', {
                            total: _json.records,
                            dataCount: _json.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);