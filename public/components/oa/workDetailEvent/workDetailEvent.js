/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workDetailEventInfo: {
                events: [],
                workId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('workDetailEvent', 'switch', function (_data) {
                $that.workDetailEventInfo.workId = _data.workId;
                $that._loadWorkDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('workDetailEvent', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadWorkDetailEventData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('workDetailEvent', 'notify', function (_data) {
                $that._loadWorkDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadWorkDetailEventData: function (_page, _row) {
                let param = {
                    params: {
                        taskId: $that.workDetailEventInfo.taskId,
                        workId: $that.workDetailEventInfo.workId,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/workEvent.listWorkEvent',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workDetailEventInfo.events = _json.data;
                        vc.emit('workDetailEvent', 'paginationPlus', 'init', {
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
            
            _openEditRoomModel: function (_room) {
                vc.emit('editRoom', 'openEditRoomModal', _room);
            },
        }
    });
})(window.vc);