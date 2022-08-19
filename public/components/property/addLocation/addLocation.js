(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addLocationInfo: {
                locationId: '',
                locationName: '',
                locationType: '',
                locationObjId: '',
                locationObjName: '',
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addLocation', 'openAddLocationModal', function() {
                $('#addLocationModel').modal('show');
            });

            vc.on("addLocation", "notify", function(_param) {
                if ($that.addLocationInfo.locationType == '6000') { //楼栋
                    vc.component.addLocationInfo.locationObjId = _param.floorId;
                    vc.component.addLocationInfo.locationObjName = _param.floorNum;
                } else if ($that.addLocationInfo.locationType == '2000') { //单元
                    vc.component.addLocationInfo.locationObjId = _param.unitId;
                    vc.component.addLocationInfo.locationObjName = _param.floorNum + _param.unitNum;
                } else if ($that.addLocationInfo.locationType == '4000') { //岗亭
                    vc.component.addLocationInfo.locationObjId = _param.boxId;
                    vc.component.addLocationInfo.locationObjName = _param.boxName;
                } else if ($that.addLocationInfo.locationType == '7000') { //部门
                    vc.component.addLocationInfo.locationObjId = _param.paId;
                    vc.component.addLocationInfo.locationObjName = _param.num;
                }
            });
            vc.on('addLocation', 'switchOrg', function(_org) {
                if ($that.addLocationInfo.locationType == '5000') { //部门
                    vc.component.addLocationInfo.locationObjId = _org.orgId;
                    vc.component.addLocationInfo.locationObjName = _org.allOrgName;
                }
            });
        },
        methods: {
            addLocationValidate() {
                return vc.validate.validate({
                    addLocationInfo: vc.component.addLocationInfo
                }, {
                    'addLocationInfo.locationName': [{
                            limit: "required",
                            param: "",
                            errInfo: "位置名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "位置名称不能超过100位"
                        },
                    ],
                    'addLocationInfo.locationType': [{
                            limit: "required",
                            param: "",
                            errInfo: "位置类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "位置类型 格式错误"
                        },
                    ],
                });
            },
            saveLocationInfo: function() {
                if ($that.addLocationInfo.locationType == '1000') { //楼栋
                    vc.component.addLocationInfo.locationObjId = vc.getCurrentCommunity().communityId;
                    vc.component.addLocationInfo.locationObjName = vc.getCurrentCommunity().name;
                }
                if (!vc.component.addLocationValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.addLocationInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addLocationInfo);
                    $('#addLocationModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'communityLocation.saveCommunityLocation',
                    JSON.stringify(vc.component.addLocationInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addLocationModel').modal('hide');
                            vc.component.clearAddLocationInfo();
                            vc.emit('locationManage', 'listLocation', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddLocationInfo: function() {
                vc.component.addLocationInfo = {
                    locationName: '',
                    locationType: '',
                    locationObjId: '',
                    locationObjName: '',
                };

                vc.emit('addLocation', 'floorSelect2', 'clearFloor', {});
                vc.emit('addLocation', 'unitSelect2', 'clearUnit', {});
                vc.emit('addLocation', 'parkingBoxSelect2', 'clearParkingBox', {});
                vc.emit('addLocation', 'parkingAreaSelect2', 'clearParkingArea', {});
                vc.emit('addLocation', 'orgSelect2', 'clearOrg', {});
                vc.emit('addLocation', 'departmentSelect2', 'clearDepartment', {});
            },
            _changeLocationType: function() {
                vc.component.addLocationInfo.locationObjId = '';
                vc.component.addLocationInfo.locationObjName = '';
            }
        }
    });

})(window.vc);