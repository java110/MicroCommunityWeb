(function (vc, vm) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addUnitInfo: {
                floorId: '',
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
            vc.on('addUnit', 'openAddUnitModal', function (_params) {
                vc.component.refreshAddUnitInfo();
                $('#addUnitModel').modal('show');
                if (_params.hasOwnProperty("floorId") && vc.notNull(_params.floorId)) {
                    vc.component.addUnitInfo.floorId = _params.floorId;
                }
                vc.component.addUnitInfo.communityId = vc.getCurrentCommunity().communityId;
            });
            vc.on('addUnit', 'addUnitModel', function (_params) {
                vc.component.refreshAddUnitInfo();
                $('#addUnitModel').modal('show');
                if (_params.hasOwnProperty("floorId") && vc.notNull(_params.floorId)) {
                    vc.component.addUnitInfo.floorId = _params.floorId;
                }
                vc.component.addUnitInfo.communityId = vc.getCurrentCommunity().communityId;
            });
            vc.on('addUnit', 'onFloorInfo', function (_params) {
                if (_params.hasOwnProperty("floorId") && vc.notNull(_params.floorId)) {
                    vc.component.addUnitInfo.floorId = _params.floorId;
                }
                vc.component.addUnitInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            addUnitValidate: function () {
                return vc.validate.validate({
                    addUnitInfo: vc.component.addUnitInfo
                }, {
                    'addUnitInfo.floorId': [{
                        limit: "required",
                        param: "",
                        errInfo: "小区楼不能为空"
                    }],
                    'addUnitInfo.unitNum': [{
                        limit: "required",
                        param: "",
                        errInfo: "单元编号不能为空"
                    },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "单元编号必须为数字"
                        },
                    ],
                    'addUnitInfo.layerCount': [{
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
                    'addUnitInfo.unitArea': [{
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
                    'addUnitInfo.lift': [{
                        limit: "required",
                        param: "",
                        errInfo: "必须选择单元是否电梯"
                    }],
                    'addUnitInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注长度不能超过200位"
                    }]
                });
            },
            addUnit: function () {
                if (!vc.component.addUnitValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.addUnitInfo.unitNum == '0') {
                    vc.toast("0单元为商铺特有，不允许添加");
                    return;
                }
                vc.component.addUnitInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addUnitInfo);
                    $('#addUnitModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/unit.saveUnit',
                    JSON.stringify(vc.component.addUnitInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addUnitModel').modal('hide');
                            vc.emit('unit', 'loadUnit', {
                                floorId: vc.component.addUnitInfo.floorId
                            });
                            vc.emit('floorUnitTree', 'refreshTree', {
                                floorId: vc.component.addUnitInfo.floorId
                            });
                            vc.toast("添加成功");
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
            refreshAddUnitInfo: function () {
                vc.component.addUnitInfo = {
                    floorId: '',
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