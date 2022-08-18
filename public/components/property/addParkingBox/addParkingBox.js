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
                paId: '',
                parkingAreas: []
            }
        },
        _initMethod: function () {
            $that._loadAddParkingBoxs();
        },
        _initEvent: function () {
            vc.on('addParkingBox', 'openAddParkingBoxModal', function (param) {
                $that.addParkingBoxInfo.boxId = param.boxId;
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
                    'addParkingBoxInfo.paId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "停车场不能为空"
                        }
                    ],
                    'addParkingBoxInfo.tempCarIn': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "临时车是否进场不能为空"
                        }
                    ],
                    'addParkingBoxInfo.fee': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否收费不能为空"
                        }
                    ],
                    'addParkingBoxInfo.blueCarIn': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "蓝牌车进场不能为空"
                        }
                    ],
                    'addParkingBoxInfo.yelowCarIn': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "黄牌车进场不能为空"
                        }
                    ]
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
                    JSON.stringify(vc.component.addParkingBoxInfo), {
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
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            _loadAddParkingBoxs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function (json, res) {
                        let _parkingAreaManageInfo = JSON.parse(json);
                        $that.addParkingBoxInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            clearAddParkingBoxInfo: function () {
                let _parkingAreas = $that.addParkingBoxInfo.parkingAreas;
                vc.component.addParkingBoxInfo = {
                    boxName: '',
                    tempCarIn: '',
                    fee: '',
                    blueCarIn: '',
                    yelowCarIn: '',
                    remark: '',
                    paId: '',
                    parkingAreas: _parkingAreas
                };
            }
        }
    });
})(window.vc);