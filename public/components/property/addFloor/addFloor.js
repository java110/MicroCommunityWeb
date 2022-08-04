(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFloorInfo: {
                floorId: '',
                name: '',
                floorName: '',
                floorArea: '',
                floorNum: '',
                remark: '',
                errorInfo: '',
                seq: '',
            }
        },
        watch: {
            "addFloorInfo.floorNum": { //深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    if (vc.notNull(val)) {
                        vc.component.addFloorInfo.name = vc.component.addFloorInfo.floorNum + "号楼";
                    } else {
                        vc.component.addFloorInfo.name = "";
                    }
                },
                deep: true
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addFloor', 'openAddFloorModal', function () {
                $('#addFloorModel').modal('show');
            });
        },
        methods: {
            addFloorValidate() {
                return vc.validate.validate({
                    addFloorInfo: vc.component.addFloorInfo
                }, {
                    'addFloorInfo.name': [{
                        limit: "required",
                        param: "",
                        errInfo: "楼名称不能为空"
                    },
                        {
                            limit: "maxin",
                            param: "2,10",
                            errInfo: "楼名称长度必须在2位至10位"
                        },
                    ],
                    'addFloorInfo.floorNum': [{
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
                    'addFloorInfo.floorArea': [{
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
                    'addFloorInfo.seq': [{
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
                    'addFloorInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]
                });
            },
            saveFloorInfo: function () {
                if (!vc.component.addFloorValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addFloorInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.component.addFloorInfo.floorName = vc.component.addFloorInfo.name;
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFloorInfo);
                    $('#addFloorModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/floor.saveFloor',
                    JSON.stringify(vc.component.addFloorInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFloorModel').modal('hide');
                            vc.component.clearAddFloorInfo();
                            vc.emit('listFloor', 'listFloorData', {});
                            vc.emit('floorUnitTree', 'refreshTree', {})
                            vc.toast("添加成功")
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                        //vc.component.addFloorInfo.errorInfo = json;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.addFloorInfo.errorInfo = errInfo;
                        vc.toast(errInfo)
                    });
            },
            clearAddFloorInfo: function () {
                vc.component.addFloorInfo = {
                    name: '',
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