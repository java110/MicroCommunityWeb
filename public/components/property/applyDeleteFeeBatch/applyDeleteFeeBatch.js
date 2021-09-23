(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            applyDeleteFeeBatchInfo: {
                batchId: '',
                createUserName: '',
                createTime: '',
                remark: '',
                communityId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('applyDeleteFeeBatch', 'openApply', function (_param) {
                $that.clearApplyDeleteFeeBatchInfo();
                vc.copyObject(_param, $that.applyDeleteFeeBatchInfo);
                $('#applyDeleteFeeBatchModel').modal('show');
            });
        },
        methods: {
            applyDeleteFeeBatchInfoValidate() {
                return vc.validate.validate({
                    applyDeleteFeeBatchInfo: vc.component.applyDeleteFeeBatchInfo
                }, {
                    'applyDeleteFeeBatchInfo.batchId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "批次不能为空"
                        }
                    ],
                    'applyDeleteFeeBatchInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "取消原因不能为空"
                        }
                    ]
                });
            },
            saveApplyDeleteFeeBatchInfo: function () {
                if (!vc.component.applyDeleteFeeBatchInfoValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.applyDeleteFeeBatchInfo.communityId = vc.getCurrentCommunity().communityId;
                
                vc.http.apiPost(
                    '/payFeeBatch.applyDeletePayFeeBatchCmd',
                    JSON.stringify(vc.component.applyDeleteFeeBatchInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#applyDeleteFeeBatchModel').modal('hide');
                            vc.component.clearApplyDeleteFeeBatchInfo();
                            vc.emit('pagination', 'page_event', 1);
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearApplyDeleteFeeBatchInfo: function () {
                vc.component.applyDeleteFeeBatchInfo = {
                    batchId: '',
                    createUserName: '',
                    createTime: '',
                    remark: '',
                    communityId: ''
                };
            },
        }
    });
})(window.vc);
