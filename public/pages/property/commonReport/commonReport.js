/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            commonReportInfo: {
                groupId: '',
                switchValue: '',
                reportCustoms: []
            }
        },
        _initMethod: function () {
            $that.commonReportInfo.groupId = vc.getParam('groupId');
            $that._loadReportCustom();
        },
        _initEvent: function () {
            vc.on('newOaWorkflow', 'listNewOaWorkflow', function (_param) {
                vc.component._listNewOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('newOaWorkflow', 'switch', function (_switchValue) {
                $that.swatch(_switchValue);
            })
        },
        methods: {
            swatch: function (_value) {
                $that.commonReportInfo.switchValue = _value.customId;
                vc.emit('commonReportTable', 'witch', {
                    customId: _value.customId
                })
            },
            _loadReportCustom: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        groupId: $that.commonReportInfo.groupId
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportCustom.listReportCustom',
                    param,
                    function (json, res) {
                        let _reportCustomManageInfo = JSON.parse(json);
                        $that.commonReportInfo.reportCustoms = _reportCustomManageInfo.data;
                        if (_reportCustomManageInfo.data != null && _reportCustomManageInfo.data != '' &&
                            _reportCustomManageInfo.data != undefined && _reportCustomManageInfo.data.length > 0) {
                            $that.swatch(_reportCustomManageInfo.data[0]);
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);
