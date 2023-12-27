/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workDetailFileInfo: {
                files: [],
                workId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('workDetailFile', 'switch', function (_data) {
                $that.workDetailFileInfo.workId = _data.workId;
                $that._loadWorkDetailFileData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('workDetailFile', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadWorkDetailFileData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('workDetailFile', 'notify', function (_data) {
                $that._loadWorkDetailFileData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadWorkDetailFileData: function (_page, _row) {
                let param = {
                    params: {
                        taskId: $that.workDetailFileInfo.taskId,
                        workId: $that.workDetailFileInfo.workId,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/work.listWorkPoolFile',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workDetailFileInfo.files = _json.data;
                        vc.emit('workDetailFile', 'paginationPlus', 'init', {
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