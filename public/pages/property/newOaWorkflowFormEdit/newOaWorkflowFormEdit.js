/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            newOaWorkflowFormEditInfo: {
                formJson: {},
                components: [],
                conditions: {
                },
                flowId: '',
                id: '',
            }
        },
        _initMethod: function () {
            $that.newOaWorkflowFormEditInfo.flowId = vc.getParam('flowId');
            $that.newOaWorkflowFormEditInfo.id = vc.getParam('id');
            vc.component._listOaWorkflowFormEdit(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

        },
        methods: {
            _listOaWorkflowFormEdit: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        flowId: $that.newOaWorkflowFormEditInfo.flowId
                    }
                };

                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowForm',
                    param,
                    function (json, res) {
                        let _newOaWorkflowFormEditInfo = JSON.parse(json);
                        $that.newOaWorkflowFormEditInfo.formJson = JSON.parse(_newOaWorkflowFormEditInfo.data[0].formJson);
                        $that.newOaWorkflowFormEditInfo.components = $that.newOaWorkflowFormEditInfo.formJson.components;
                        $that._listOaWorkflowDetails();

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOaWorkflowDetails: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        id: $that.newOaWorkflowFormEditInfo.id,
                        flowId: $that.newOaWorkflowFormEditInfo.flowId
                    }
                };

                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowFormData',
                    param,
                    function (json, res) {
                        var _newOaWorkflowDetailInfo = JSON.parse(json);
                        let _data = _newOaWorkflowDetailInfo.data[0];
                        $that.newOaWorkflowFormEditInfo.components.forEach(item => {
                            item.value = _data[item.key];
                        })
                        $that.$forceUpdate();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _submitFormData() {
                //做数据校验
                let _components = $that.newOaWorkflowFormEditInfo.components;
                let _data = {
                    id: $that.newOaWorkflowFormEditInfo.id,
                    flowId: $that.newOaWorkflowFormEditInfo.flowId
                };

                _components.forEach(item => {
                    if (item.validate && item.validate.required == true && !item.value) {
                        vc.toast(item.label + "不能为空")
                        throw Error(item.label + "不能为空");
                    }
                    if (item.type != 'button' && item.type != 'text') {
                        _data[item.key] = item.value;
                        if (item.type == 'checkbox') {
                            _data[item.key] = item.value.length > 0 ? item.value[0] : '';
                        }
                    }
                });

                vc.http.apiPost(
                    '/oaWorkflow.updateOaWorkflowFormData',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            $that.closeEditInfo();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            closeEditInfo: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
