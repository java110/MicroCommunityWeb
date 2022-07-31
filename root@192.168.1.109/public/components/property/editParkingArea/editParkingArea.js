(function(vc, vm) {

    vc.extends({
        data: {
            editParkingAreaInfo: {
                paId: '',
                num: '',
                typeCd: '',
                remark: '',
                attrs: []
            }
        },
        _initMethod: function() {
            $that._loadEditParkingAreaAttrSpec();
        },
        _initEvent: function() {
            vc.on('editParkingArea', 'openEditParkingAreaModal',
                function(_params) {
                    vc.component.refreshEditParkingAreaInfo();
                    $('#editParkingAreaModel').modal('show');
                    vc.copyObject(_params, vc.component.editParkingAreaInfo);
                    if (_params.hasOwnProperty('attrs')) {
                        let _attrDtos = _params.attrs;
                        _attrDtos.forEach(item => {
                            $that.editParkingAreaInfo.attrs.forEach(attrItem => {
                                if (item.specCd == attrItem.specCd) {
                                    attrItem.attrId = item.attrId;
                                    attrItem.value = item.value;
                                }
                            })
                        })
                    }
                    vc.component.editParkingAreaInfo.communityId = vc.getCurrentCommunity().communityId;
                });
        },
        methods: {
            editParkingAreaValidate: function() {
                return vc.validate.validate({
                    editParkingAreaInfo: vc.component.editParkingAreaInfo
                }, {
                    'editParkingAreaInfo.num': [{
                            limit: "required",
                            param: "",
                            errInfo: "停车场编号不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,12",
                            errInfo: "停车场编号不能超过12位"
                        },
                    ],
                    'editParkingAreaInfo.typeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "停车场类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "停车场类型格式错误"
                        },
                    ],
                    'editParkingAreaInfo.remark': [{
                        limit: "maxLength",
                        param: "4000",
                        errInfo: "备注太长"
                    }, ],
                    'editParkingAreaInfo.paId': [{
                        limit: "required",
                        param: "",
                        errInfo: "停车场ID不能为空"
                    }]

                });
            },
            editParkingArea: function() {
                vc.component.editParkingAreaInfo.communityId = vc.getCurrentCommunity().communityId;

                if (!vc.component.editParkingAreaValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost('/parkingArea.updateParkingArea', JSON.stringify(vc.component.editParkingAreaInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editParkingAreaModel').modal('hide');
                            vc.emit('parkingAreaManage', 'listParkingArea', {});
                            return;
                        }

                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditParkingAreaInfo: function() {
                let _attrs = $that.editParkingAreaInfo.attrs;
                vc.component.editParkingAreaInfo = {
                    paId: '',
                    num: '',
                    typeCd: '',
                    remark: '',
                    attrs: _attrs
                }
            },
            _loadEditParkingAreaAttrSpec: function() {
                $that.editParkingAreaInfo.attrs = [];
                vc.getAttrSpec('parking_area_attr', function(data) {
                    data.forEach(item => {
                        item.value = '';
                        item.values = [];
                        $that._loadEditAttrValue(item.specCd, item.values);
                        if (item.specShow == 'Y') {
                            $that.editParkingAreaInfo.attrs.push(item);
                        }
                    });

                });
            },
            _loadEditAttrValue: function(_specCd, _values) {
                vc.getAttrValue(_specCd, function(data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });

                });
            },
        }
    });

})(window.vc, window.vc.component);