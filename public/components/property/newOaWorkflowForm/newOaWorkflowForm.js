/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            newOaWorkflowFormInfo: {
                formJson: {},
                conditions: {
                },
                flowId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('newOaWorkflowForm', 'witch', function (_value) {
                $that.newOaWorkflowFormInfo.flowId = _value.flowId;
                vc.component._listOaWorkflowForm(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _listOaWorkflowForm: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        flowId: $that.newOaWorkflowFormInfo.flowId
                    }
                };

                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowForm',
                    param,
                    function (json, res) {
                        let _newOaWorkflowFormInfo = JSON.parse(json);
                        $that.newOaWorkflowFormInfo.formJson = JSON.parse(_newOaWorkflowFormInfo.data[0].formJson);
                        $that._initForm();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initForm: function () {
                const container = document.querySelector('#form');
                FormViewer.createForm({
                    container,
                    schema: $that.newOaWorkflowFormInfo.formJson
                });
            },
        }
    });
})(window.vc);
