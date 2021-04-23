(function (vc) {
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionTaskDetailInfo: {
                taskDetails: [],
                taskId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('inspectionTaskDetail', 'openInspectionTaskDetail', function (_param) {
                $that._refreshInspectionTaskDetailInfo();
                $('#inspectionTaskDetailModel').modal('show');
                vc.copyObject(_param, $that.inspectionTaskDetailInfo);
                $that._loadAllTaskDetailInfo(1, 10);
            });

            vc.on('inspectionTaskDetail', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._loadAllTaskDetailInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadAllTaskDetailInfo: function (_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        taskId: $that.inspectionTaskDetailInfo.taskId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('inspectionTaskDetail.listInspectionTaskDetails',
                    param,
                    function (json) {
                        var _taskDetailInfo = JSON.parse(json);
                        $that.inspectionTaskDetailInfo.taskDetails = _taskDetailInfo.inspectionTaskDetails;
                        vc.emit('inspectionTaskDetail', 'paginationPlus', 'init', {
                            total: _taskDetailInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _refreshInspectionTaskDetailInfo: function () {
                $that.inspectionTaskDetailInfo = {
                    taskDetails: [],
                    taskId: '',
                };
            }, 
            openFile:function(_photo){
                vc.emit('viewImage','showImage',{
                    url:_photo.url
                });
             }
        }

    });
})(window.vc);
