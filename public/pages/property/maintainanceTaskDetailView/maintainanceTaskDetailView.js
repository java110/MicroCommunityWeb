(function (vc) {
    vc.extends({
        data: {
            maintainanceTaskDetailViewInfo: {
                taskDetailId: '',
                machineName: '',
                planName: '',
                standardName: '',
                planUserName: '',
                planInsTime: '',
                planEndTime: '',
                actUserName: '',
                maintainanceTime: '',
                stateName: '',
                description: '',
                photos: [],
            }
        },
        _initMethod: function () {
            let taskDetailId = vc.getParam('taskDetailId');
            $that.maintainanceTaskDetailViewInfo.taskDetailId = taskDetailId;
            $that._listMaintainanceTasksDetailList()
        },
        _initEvent: function () {
        },
        methods: {
            _listMaintainanceTasksDetailList: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:1,
                        communityId:vc.getCurrentCommunity().communityId,
                        taskDetailId: $that.maintainanceTaskDetailViewInfo.taskDetailId
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainanceTask.listMaintainanceTaskDetail',
                    param,
                    function (json, res) {
                        let _maintainanceTaskDetailManageInfo = JSON.parse(json);
                        vc.copyObject(_maintainanceTaskDetailManageInfo.data[0],$that.maintainanceTaskDetailViewInfo);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack()
            },
            openFile: function (_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            },
            /**
             * 新增打印功能，跳转打印页面
             */
            _printRepairDetail: function () {
                window.open("/print.html#/pages/property/printRepairDetail?taskDetailId=" + $that.maintainanceTaskDetailViewInfo.taskDetailId + "&repairType=" + $that.maintainanceTaskDetailViewInfo.repairType)
            },
        }
    });
})(window.vc);