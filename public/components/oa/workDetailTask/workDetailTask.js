/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workDetailTaskInfo: {
                tasks: [],
                workId: '',
                staffNameLike:'',
                queryStartTime:'',
                queryEndTime:'',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('workDetailTask', 'switch', function (_data) {
                $that.workDetailTaskInfo.workId = _data.workId;
                $that._loadWorkDetailTaskData(DEFAULT_PAGE, DEFAULT_ROWS);
                setTimeout(function(){
                    vc.initDateTime('taskQueryStartTime',function(_value){
                        $that.workDetailTaskInfo.queryStartTime = _value;
                    });
                    vc.initDateTime('taskQueryEndTime',function(_value){
                        $that.workDetailTaskInfo.queryEndTime = _value;
                    });
                },1000)
            });
            vc.on('workDetailTask', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadWorkDetailTaskData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('workDetailTask', 'notify', function (_data) {
                $that._loadWorkDetailTaskData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadWorkDetailTaskData: function (_page, _row) {
                let param = {
                    params: {
                        taskId: $that.workDetailTaskInfo.taskId,
                        workId: $that.workDetailTaskInfo.workId,
                        staffNameLike: $that.workDetailTaskInfo.staffNameLike,
                        queryStartTime:$that.workDetailTaskInfo.queryStartTime,
                        queryEndTime:$that.workDetailTaskInfo.queryEndTime,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/work.listWorkTask',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.workDetailTaskInfo.tasks = _json.data;
                        vc.emit('workDetailTask', 'paginationPlus', 'init', {
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

            _qureyWorkDetailTask:function(){
                $that._loadWorkDetailTaskData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            
            _openEditRoomModel: function (_room) {
                vc.emit('editRoom', 'openEditRoomModal', _room);
            },
        }
    });
})(window.vc);