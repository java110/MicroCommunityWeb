(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFeeCollectionOrderInfo: {
                collectionWay: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addFeeCollectionOrder', 'openAddFeeCollectionOrderModal', function () {
                $('#addFeeCollectionOrderModel').modal('show');
            });
        },
        methods: {
            addFeeCollectionOrderValidate() {
                return vc.validate.validate({
                    addFeeCollectionOrderInfo: vc.component.addFeeCollectionOrderInfo
                }, {
                    'addFeeCollectionOrderInfo.collectionWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "催缴方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "催缴方式超过64位"
                        },
                    ],
                    'addFeeCollectionOrderInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ],
                });
            },
            saveFeeCollectionOrderInfo: function () {
                if (!vc.component.addFeeCollectionOrderValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.addFeeCollectionOrderInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFeeCollectionOrderInfo);
                    $('#addFeeCollectionOrderModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/feeCollectionOrder/saveFeeCollectionOrder',
                    JSON.stringify(vc.component.addFeeCollectionOrderInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeeCollectionOrderModel').modal('hide');
                            vc.component.clearAddFeeCollectionOrderInfo();
                            vc.emit('feeCollectionOrderManage', 'listFeeCollectionOrder', {});
                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddFeeCollectionOrderInfo: function () {
                $that.addFeeCollectionOrderInfo = {
                    collectionWay: '',
                    remark: '',
                };
            }
        }
    });

})(window.vc);
