/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workDetailCopyInfo: {
                copys: [],
                workId: '',
                staffNameLike:'',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('workDetailCopy', 'switch', function (_data) {
                $that.workDetailCopyInfo.workId = _data.workId;
                $that._loadWorkDetailCopyData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('workDetailCopy', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadWorkDetailCopyData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('workDetailCopy', 'notify', function (_data) {
                $that._loadWorkDetailCopyData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadWorkDetailCopyData: function (_page, _row) {
                let param = {
                    params: {
                        taskId: $that.workDetailCopyInfo.taskId,
                        workId: $that.workDetailCopyInfo.workId,
                        staffNameLike:$that.workDetailCopyInfo.staffNameLike,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/work.listWorkCopy',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workDetailCopyInfo.copys = _json.data;
                        vc.emit('workDetailCopy', 'paginationPlus', 'init', {
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
            _qureyWorkDetailCopy:function(){
                $that._loadWorkDetailCopyData(DEFAULT_PAGE, DEFAULT_ROWS);
            }
            
        }
    });
})(window.vc);