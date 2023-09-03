(function (vc, vm) {
    vc.extends({
        data: {
            editUnitInfo: {
                floorId: '',
                unitId: '',
                unitNum: '',
                layerCount: '',
                lift: '',
                remark: '',
                communityId: '',
                unitArea: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editUnit', 'openUnitModel', function (_params) {
                vc.component.refreshEditUnitInfo();
                $('#editUnitModel').modal('show');
                // = _params;
                vc.copyObject(_params, vc.component.editUnitInfo);
                vc.component.editUnitInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editUnitValidate: function () {
                return vc.validate.validate({
                    editUnitInfo: vc.component.editUnitInfo
                }, {
                    'editUnitInfo.floorId': [{
                        limit: "required",
                        param: "",
                        errInfo: "小区楼不能为空"
                    }],
                    'editUnitInfo.unitNum': [{
                        limit: "required",
                        param: "",
                        errInfo: "单元编号不能为空"
                    }],
                    'editUnitInfo.layerCount': [{
                        limit: "required",
                        param: "",
                        errInfo: "单元楼层高度不能为空"
                    },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "单元楼层高度必须为数字"
                        }
                    ],
                    'editUnitInfo.unitArea': [{
                        limit: "required",
                        param: "",
                        errInfo: "建筑面积不能为空"
                    },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "建筑面积错误 如300.00"
                        }
                    ],
                    'editUnitInfo.lift': [{
                        limit: "required",
                        param: "",
                        errInfo: "必须选择单元是否电梯"
                    }],
                    'editUnitInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注长度不能超过200位"
                    }]
                });
            },
            editUnit: function () {
                if (!vc.component.editUnitValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.addUnitInfo.unitNum == '0') {
                    vc.toast("0单元为商铺特有，不允许修改");
                    return;
                }
                vc.http.apiPost(
                    '/unit.updateUnit',
                    JSON.stringify(vc.component.editUnitInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editUnitModel').modal('hide');
                            vc.emit('unit', 'loadUnit', {
                                floorId: vc.component.editUnitInfo.floorId
                            });
                            vc.emit('floorUnitTree', 'refreshTree', {floorId: vc.component.editUnitInfo.floorId});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditUnitInfo: function () {
                vc.component.editUnitInfo = {
                    floorId: '',
                    unitId: '',
                    unitNum: '',
                    layerCount: '',
                    lift: '',
                    remark: '',
                    communityId: '',
                    unitArea: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);