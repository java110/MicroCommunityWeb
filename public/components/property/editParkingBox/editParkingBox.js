(function (vc, vm) {
    vc.extends({
        data: {
            editParkingBoxInfo: {
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
            $that._loadEditParkingBoxs();
        },
        _initEvent: function () {
            vc.on('editParkingBox', 'openEditParkingBoxModal', function (_params) {
                vc.component.refreshEditParkingBoxInfo();
                $('#editParkingBoxModel').modal('show');
                vc.copyObject(_params, vc.component.editParkingBoxInfo);
                vc.component.editParkingBoxInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editParkingBoxValidate: function () {
                return vc.validate.validate({
                    editParkingBoxInfo: vc.component.editParkingBoxInfo
                }, {
                    'editParkingBoxInfo.boxName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "岗亭名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "岗亭名称不能超过64"
                        }
                    ],
                    'editParkingBoxInfo.paId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "停车场不能为空"
                        }
                    ],
                    'editParkingBoxInfo.tempCarIn': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "临时车是否进场不能为空"
                        }
                    ],
                    'editParkingBoxInfo.fee': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否收费不能为空"
                        }
                    ],
                    'editParkingBoxInfo.blueCarIn': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "蓝牌车进场不能为空"
                        }
                    ],
                    'editParkingBoxInfo.yelowCarIn': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "黄牌车进场不能为空"
                        }
                    ]
                });
            },
            editParkingBox: function () {
                if (!vc.component.editParkingBoxValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'parkingBox.updateParkingBox',
                    JSON.stringify(vc.component.editParkingBoxInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editParkingBoxModel').modal('hide');
                            vc.emit('parkingBoxManage', 'listParkingBox', {});
                            vc.toast("修改成功");
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
            _loadEditParkingBoxs: function () {
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
                        $that.editParkingBoxInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            refreshEditParkingBoxInfo: function () {
                let _parkingAreas = $that.editParkingBoxInfo.parkingAreas;
                vc.component.editParkingBoxInfo = {
                    boxId: '',
                    boxName: '',
                    tempCarIn: '',
                    fee: '',
                    blueCarIn: '',
                    yelowCarIn: '',
                    remark: '',
                    paId: '',
                    parkingAreas: _parkingAreas
                }
            }
        }
    });
})(window.vc, window.vc.component);