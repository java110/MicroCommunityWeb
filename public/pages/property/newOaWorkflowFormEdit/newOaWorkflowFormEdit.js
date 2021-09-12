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
                flowId: '',
                id:'',
            }
        },
        _initMethod: function () {
            $that.newOaWorkflowFormInfo.flowId = vc.getParam('flowId');
            $that.newOaWorkflowFormInfo.id = vc.getParam('id');
            vc.component._listOaWorkflowForm(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
          
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
                const form = FormViewer.createForm({
                    container,
                    schema: $that.newOaWorkflowFormInfo.formJson
                });
                console.log(form);
                form.then((_from) => {
                    _from.on('submit', (event) => {
                        $that._submitFormData(event.data, event.errors);
                    })
                })
            },
            _submitFormData(_data, _err) {
                if (Object.keys(_err).length != 0) {
                    return;
                }
                console.log('我要的数据', _data);
                _data.flowId = $that.newOaWorkflowFormInfo.flowId;

                vc.http.apiPost(
                    '/oaWorkflow/saveOaWorkflowFormData',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            vc.emit('newOaWorkflow', 'switch', 'newOaWorkflowPool')
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            }
        }
    });
})(window.vc);
