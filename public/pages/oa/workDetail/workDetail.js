/**
 业主详情页面
 **/
(function (vc) {
    vc.extends({
        data: {
            workDetailInfo: {
                viewWorkFlag: '',
                workId: "",
                wtId:'',
                workName: '',
                typeName: "",
                workCycle: "",
                startTime: "",
                endTime: "",
                createUserName: "",
                curStaffName: "",
                curCopyName: "",
                stateName: "",
                createTime: '',
                content:'',
                pathUrl:'',
                _currentTab: 'workDetailContent',
            }
        },
        _initMethod: function () {
            $that.workDetailInfo.workId = vc.getParam('workId');
            if (!vc.notNull($that.workDetailInfo.workId)) {
                return;
            }
            let _currentTab = vc.getParam('currentTab');
            if (_currentTab) {
                $that.workDetailInfo._currentTab = _currentTab;
            }
            $that._loadWorkInfo();
            $that.changeTab($that.workDetailInfo._currentTab);
        },
        _initEvent: function () {
            vc.on('workDetail', 'listWorkData', function (_info) {
                $that._loadWorkInfo();
                $that.changeTab($that.workDetailInfo._currentTab);
            });
        },
        methods: {
            _loadWorkInfo: function () {
                let param = {
                    params: {
                        workId: $that.workDetailInfo.workId,
                        page: 1,
                        row: 1,
                    }
                }
                //发送get请求
                vc.http.apiGet('/work.listWorkPool',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.copyObject(_json.data[0], $that.workDetailInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function (_tab) {
                $that.workDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    taskId: $that.workDetailInfo.taskId,
                    workId: $that.workDetailInfo.workId,
                    wtId:$that.workDetailInfo.wtId
                })
            },
        }
    });
})(window.vc);