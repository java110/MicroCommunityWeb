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
                staffNameLike:'',
                queryStartTime:'',
                queryEndTime:'',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('workDetailEvent', 'switch', function (_data) {
                $that.workDetailEventInfo.workId = _data.workId;
                $that._loadWorkDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
                setTimeout(function(){
                    vc.initDateTime('eventQueryStartTime',function(_value){
                        $that.workDetailEventInfo.queryStartTime = _value;
                    });
                    vc.initDateTime('eventQueryEndTime',function(_value){
                        $that.workDetailEventInfo.queryEndTime = _value;
                    });
                },1000)
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
                        staffNameLike:$that.workDetailEventInfo.staffNameLike,
                        queryStartTime:$that.workDetailEventInfo.queryStartTime,
                        queryEndTime:$that.workDetailEventInfo.queryEndTime,
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
            
            _qureyWorkDetailEvent: function (_room) {
                $that._loadWorkDetailEventData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);