(function (vc) {
    vc.extends({
        data: {
            editFloorInfo: {
                floorId: '',
                floorName: '',
                floorNum: '',
                floorArea: '',
                remark: '',
                errorInfo: '',
                seq: '',
            }
        },
        // watch: {
        //     "editFloorInfo.floorNum": { //深度监听，可监听到对象、数组的变化
        //         handler(val, oldVal) {
        //             if (vc.notNull(val)) {
        //                 vc.component.editFloorInfo.floorName = vc.component.editFloorInfo.floorNum + "号楼";
        //             } else {
        //                 vc.component.editFloorInfo.floorName = "";
        //             }
        //         },
        //         deep: true
        //     }
        // },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editFloor', 'openEditFloorModal', function (_floor) {
                vc.component.editFloorInfo.errorInfo = "";
                vc.copyObject(_floor, vc.component.editFloorInfo);
                $('#editFloorModel').modal('show');
            });
        },
        methods: {
            editFloorValidate() {
                return vc.validate.validate({
                    editFloorInfo: vc.component.editFloorInfo
                }, {
                    'editFloorInfo.floorName': [{
                        limit: "required",
                        param: "",
                        errInfo: "楼名称不能为空"
                    },
                        {
                            limit: "maxin",
                            param: "1,10",
                            errInfo: "楼名称长度必须在2位至10位"
                        },
                    ],
                    'editFloorInfo.floorNum': [{
                        limit: "required",
                        param: "",
                        errInfo: "楼编号不能为空"
                    },
                        {
                            limit: "maxin",
                            param: "1,12",
                            errInfo: "楼编号长度必须在1位至12位"
                        },
                    ],
                    'editFloorInfo.floorArea': [{
                        limit: "required",
                        param: "",
                        errInfo: "建筑面积不能为空"
                    },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "建筑面积错误，如300.00"
                        },
                    ],
                    'editFloorInfo.seq': [{
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "number",
                            param: "",
                            errInfo: "排序必须是数字"
                        },
                    ],
                    'editFloorInfo.remark': [

                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]
                });
            },
            editFloorMethod: function () {
                if (!vc.component.editFloorValidate()) {
                    vc.component.editFloorInfo.errorInfo = vc.validate.errInfo;
                    return;
                }
                vc.component.editFloorInfo.errorInfo = "";
                vc.component.editFloorInfo.communityId = vc.getCurrentCommunity().communityId;
                $that.editFloorInfo.name = $that.editFloorInfo.floorName;
                vc.http.apiPost(
                    '/floor.editFloor',
                    JSON.stringify(vc.component.editFloorInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFloorModel').modal('hide');
                            vc.component.clearEditFloorInfo();
                            vc.emit('listFloor', 'listFloorData', {});
                            vc.emit('floorUnitTree', 'refreshTree', {
                                floorId: $that.editFloorInfo.floorId
                            })
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.editFloorInfo.errorInfo = errInfo;
                    });
            },
            clearEditFloorInfo: function () {
                vc.component.editFloorInfo = {
                    floorId: '',
                    floorName: '',
                    floorNum: '',
                    floorArea: '',
                    remark: '',
                    errorInfo: '',
                    seq: '',
                };
            }
        }
    });
})(window.vc);