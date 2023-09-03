(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string,
            //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addParkingAreaInfo: {
                paId: '',
                num: '',
                typeCd: '',
                remark: '',
                attrs: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addParkingArea', 'openAddParkingAreaModal',
                function () {
                    $that._loadParkingAreaAttrSpec();
                    $('#addParkingAreaModel').modal('show');
                }
            );
        },
        methods: {
            addParkingAreaValidate() {
                return vc.validate.validate({
                    addParkingAreaInfo: vc.component.addParkingAreaInfo
                }, {
                    'addParkingAreaInfo.num': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "停车场编号不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,12",
                            errInfo: "停车场编号不能超过12位"
                        }
                    ],
                    'addParkingAreaInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "停车场类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "停车场类型格式错误"
                        }
                    ],
                    'addParkingAreaInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "4000",
                            errInfo: "备注太长"
                        }
                    ]
                });
            },
            saveParkingAreaInfo: function () {
                if (!vc.component.addParkingAreaValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addParkingAreaInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addParkingAreaInfo);
                    $('#addParkingAreaModel').modal('hide');
                    return;
                }
                vc.http.apiPost('/parkingArea.saveParkingArea', JSON.stringify(vc.component.addParkingAreaInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addParkingAreaModel').modal('hide');
                            vc.component.clearAddParkingAreaInfo();
                            vc.emit('parkingAreaManage', 'listParkingArea', {});
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
            clearAddParkingAreaInfo: function () {
                vc.component.addParkingAreaInfo = {
                    num: '',
                    typeCd: '',
                    remark: '',
                    attrs: []
                };
            },
            _loadParkingAreaAttrSpec: function () {
                $that.addParkingAreaInfo.attrs = [];
                vc.getAttrSpec('parking_area_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addParkingAreaInfo.attrs.push(item);
                        }
                    });
                });
            },
            _loadAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                });
            },
        }
    });
})(window.vc);