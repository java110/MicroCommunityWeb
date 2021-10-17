(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addParkingBoxInfo: {
                boxId: '',
                boxName: '',
                tempCarIn: '',
                fee: '',
                blueCarIn: '',
                yelowCarIn: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addParkingBox', 'openAddParkingBoxModal', function () {
                $('#addParkingBoxModel').modal('show');
            });
        },
        methods: {
            addParkingBoxValidate() {
                return vc.validate.validate({
                    addParkingBoxInfo: vc.component.addParkingBoxInfo
                }, {
                    'addParkingBoxInfo.boxName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "岗亭名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "岗亭名称不能超过64"
                        },
                    ],
                    'addParkingBoxInfo.tempCarIn': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "临时车是否进场不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "临时车是否进场不能超过12"
                        },
                    ],
                    'addParkingBoxInfo.fee': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否收费不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "岗亭是否不能超过12"
                        },
                    ],
                    'addParkingBoxInfo.blueCarIn': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "蓝牌车进场不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "蓝牌车是否可以进场不能超过12"
                        },
                    ],
                    'addParkingBoxInfo.yelowCarIn': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "黄牌车进场不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "黄牌车是否可以进场不能超过12"
                        },
                    ],
                    'addParkingBoxInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "300",
                            errInfo: "备注不能超过300"
                        },
                    ],




                });
            },
            saveParkingBoxInfo: function () {
                if (!vc.component.addParkingBoxValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addParkingBoxInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addParkingBoxInfo);
                    $('#addParkingBoxModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'parkingBox.saveParkingBox',
                    JSON.stringify(vc.component.addParkingBoxInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addParkingBoxModel').modal('hide');
                            vc.component.clearAddParkingBoxInfo();
                            vc.emit('parkingBoxManage', 'listParkingBox', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddParkingBoxInfo: function () {
                vc.component.addParkingBoxInfo = {
                    boxName: '',
                    tempCarIn: '',
                    fee: '',
                    blueCarIn: '',
                    yelowCarIn: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
