(function (vc) {
    vc.extends({
        data: {
            addRoomViewInfo: {
                roomNum: '',
                layer: '',
                section: '0',
                apartment: '10102',
                builtUpArea: '',
                feeCoefficient: '1.00',
                state: '2002',
                remark: '',
                roomSubType: '110',
                roomArea: '',
                roomRent: '0',
                unitPrice: '0',
                floorId: '',
                unitId: '',
                ownerId: '',
                ownerName: '',
                communityId: vc.getCurrentCommunity().communityId,
                attrs: [],
                roomSubTypes: [],
                floors: [],
                units: []
            }
        },
        _initMethod: function () {
            $that._loadRoomAttrSpec();
            //与字典表关联
            vc.getDict('building_room', "room_sub_type", function (_data) {
                vc.component.addRoomViewInfo.roomSubTypes = _data;
            });
            $that._loadFloor();
        },
        _initEvent: function () {
            vc.on('addRoomView', 'chooseOwner', function (_owner) {
                $that.addRoomViewInfo.ownerName = _owner.name;
                $that.addRoomViewInfo.ownerId = _owner.ownerId;
            });
        },
        methods: {
            addRoomValidate() {
                return vc.validate.validate({
                    addRoomViewInfo: vc.component.addRoomViewInfo
                }, {
                    'addRoomViewInfo.roomNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "房屋编号长度不能超过64位"
                        }
                    ],
                    'addRoomViewInfo.layer': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋楼层不能为空"
                        }
                    ],
                    'addRoomViewInfo.apartment': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋户型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "房屋户型不能大于50"
                        }
                    ],
                    'addRoomViewInfo.builtUpArea': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "建筑面积不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "建筑面积错误，如 300.00"
                        }
                    ],
                    'addRoomViewInfo.roomArea': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "室内面积不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "室内面积错误，如 300.00"
                        }
                    ],
                    'addRoomViewInfo.feeCoefficient': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "算费系数不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "算费系数错误，如 300.00"
                        }
                    ],
                    'addRoomViewInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "房屋状态 不能超过12位"
                        }
                    ],
                    'addRoomViewInfo.roomSubType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋类型不能为空"
                        }
                    ],
                    'addRoomViewInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        }
                    ]
                });
            },
            _loadRoomAttrSpec: function () {
                $that.addRoomViewInfo.attrs = [];
                vc.getAttrSpec('building_room_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addRoomViewInfo.attrs.push(item);
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
            saveAddRoomInfo: function () {
                let msg = '';
                vc.component.addRoomViewInfo.attrs.forEach((item) => {
                    if (item.required == 'Y' && item.value == "") {
                        msg = item.specHoldplace;
                    }
                })
                if (msg) {
                    vc.toast(msg);
                    return;
                }
                if (!vc.component.addRoomValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/room.saveRoom',
                    JSON.stringify($that.addRoomViewInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _tmpResJson = JSON.parse(json);
                        if (_tmpResJson.code == 0) {
                            //关闭model
                            vc.goBack();
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_tmpResJson.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _goBack: function () {
                vc.goBack();
            },
            _openChooseOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            _loadFloor: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 300,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                //发送get请求
                vc.http.apiGet('/floor.queryFloors',
                    param,
                    function (json, res) {
                        let listFloorData = JSON.parse(json);
                        $that.addRoomViewInfo.floors = listFloorData.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadUnit: function () {
                if (!$that.addRoomViewInfo.floorId) {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 300,
                        communityId: vc.getCurrentCommunity().communityId,
                        floorId: $that.addRoomViewInfo.floorId
                    }
                }
                //发送get请求
                vc.http.apiGet('/unit.queryUnits',
                    param,
                    function (json, res) {
                        let listFloorData = JSON.parse(json);
                        $that.addRoomViewInfo.units = listFloorData;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);