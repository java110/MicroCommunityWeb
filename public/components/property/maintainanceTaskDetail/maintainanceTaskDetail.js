(function (vc) {
    var photoUrl = '/callComponent/download/getFile/file';
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            maintainanceTaskDetailInfo: {
                taskDetails: [],
                taskId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('maintainanceTaskDetail', 'openMaintainanceTaskDetail', function (_param) {
                $that._refreshMaintainanceTaskDetailInfo();
                $('#maintainanceTaskDetailModel').modal('show');
                vc.copyObject(_param, $that.maintainanceTaskDetailInfo);
                $that._loadAllTaskDetailInfo(1, 10);
            });

            vc.on('maintainanceTaskDetail', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._loadAllTaskDetailInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadAllTaskDetailInfo: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        taskId: $that.maintainanceTaskDetailInfo.taskId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainanceTask.listMaintainanceTaskDetail',
                    param,
                    function (json) {
                        var _taskDetailInfo = JSON.parse(json);
                        $that.maintainanceTaskDetailInfo.taskDetails = _taskDetailInfo.data;
                       
                        vc.emit('maintainanceTaskDetail', 'paginationPlus', 'init', {
                            total: _taskDetailInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _refreshMaintainanceTaskDetailInfo: function () {
                $that.maintainanceTaskDetailInfo = {
                    taskDetails: [],
                    taskId: '',
                };
            },
            openFile: function (_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            },
            openMap: function (lat, lng) {
                if(!lat || !lng){
                    vc.toast('暂无位置信息');
                    return;
                }
                vc.emit('viewMap', 'showMap', {
                    lat: lat,
                    lng: lng
                });
            }
        }
    });
})(window.vc);
