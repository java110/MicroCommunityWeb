/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workDetailCycleInfo: {
                cycles: [],
                workId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('workDetailCycle', 'switch', function (_data) {
                $that.workDetailCycleInfo.workId = _data.workId;
                $that._loadWorkDetailCycleData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('workDetailCycle', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadWorkDetailCycleData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('workDetailCycle', 'notify', function (_data) {
                $that._loadWorkDetailCycleData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadWorkDetailCycleData: function (_page, _row) {
                let param = {
                    params: {
                        taskId: $that.workDetailCycleInfo.taskId,
                        workId: $that.workDetailCycleInfo.workId,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/workCycle.listWorkCycle',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workDetailCycleInfo.cycles = _json.data;
                        vc.emit('workDetailCycle', 'paginationPlus', 'init', {
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