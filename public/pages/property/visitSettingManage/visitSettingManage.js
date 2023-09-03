/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            visitSettingManageInfo: {
                visitSettings: [],
                total: 0,
                records: 1,
                moreCondition: false,
                settingId: '',
                conditions: {
                    typeName: '',
                    faceWay: '',
                    carNumWay: '',
                    auditWay: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listVisitSettings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('visitSettingManage', 'listVisitSetting', function (_param) {
                vc.component._listVisitSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listVisitSettings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listVisitSettings: function (_page, _rows) {
                vc.component.visitSettingManageInfo.conditions.page = _page;
                vc.component.visitSettingManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.visitSettingManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/visit.listVisitSetting',
                    param,
                    function (json, res) {
                        var _visitSettingManageInfo = JSON.parse(json);
                        vc.component.visitSettingManageInfo.total = _visitSettingManageInfo.total;
                        vc.component.visitSettingManageInfo.records = _visitSettingManageInfo.records;
                        vc.component.visitSettingManageInfo.visitSettings = _visitSettingManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.visitSettingManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddVisitSettingModal: function () {
                vc.emit('addVisitSetting', 'openAddVisitSettingModal', {});
            },
            _openEditVisitSettingModel: function (_visitSetting) {
                vc.emit('editVisitSetting', 'openEditVisitSettingModal', _visitSetting);
            },
            _queryVisitSettingMethod: function () {
                vc.component._listVisitSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.visitSettingManageInfo.moreCondition) {
                    vc.component.visitSettingManageInfo.moreCondition = false;
                } else {
                    vc.component.visitSettingManageInfo.moreCondition = true;
                }
            },
            _settingFlow: function (visitSetting) {
                window.open('/bpmnjs/index.html?flowId=' + visitSetting.flowId + "&modelId=" + visitSetting.modelId);
            },
            _openDeployWorkflow: function (visitSetting) {
                let _param = {
                    modelId: visitSetting.modelId
                };
                //发送get请求
                vc.http.apiPost('/workflow/deployModel',
                    JSON.stringify(_param),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg)
                        vc.emit('visitSettingManage', 'listVisitSetting', {});
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);
