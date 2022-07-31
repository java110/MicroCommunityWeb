(function(vc, vm) {

    vc.extends({
        data: {
            editLocationInfo: {
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
            vc.on('editLocation', 'openEditLocationModal', function(_params) {
                vc.component.refreshEditLocationInfo();
                $('#editLocationModel').modal('show');
                vc.copyObject(_params, vc.component.editLocationInfo);
                vc.component.editLocationInfo.communityId = vc.getCurrentCommunity().communityId;

            });

            vc.on("editLocation", "notify", function(_param) {
                if ($that.editLocationInfo.locationType == '6000' && _param.floorNum) { //楼栋
                    vc.component.editLocationInfo.locationObjId = _param.floorId;
                    vc.component.editLocationInfo.locationObjName = _param.floorNum;
                } else if ($that.editLocationInfo.locationType == '2000' && _param.unitName) { //单元
                    vc.component.editLocationInfo.locationObjId = _param.unitId;
                    vc.component.editLocationInfo.locationObjName = _param.floorNum + _param.unitName;
                } else if ($that.editLocationInfo.locationType == '4000' && _param.boxName) { //岗亭
                    vc.component.editLocationInfo.locationObjId = _param.boxId;
                    vc.component.editLocationInfo.locationObjName = _param.boxName;
                } else if ($that.editLocationInfo.locationType == '7000' && _param.num) { //部门
                    vc.component.editLocationInfo.locationObjId = _param.paId;
                    vc.component.editLocationInfo.locationObjName = _param.num;
                }
            });


            vc.on('editLocation', 'switchOrg', function(_org) {
                if ($that.editLocationInfo.locationType == '5000' && _org.allOrgName) { //部门
                    vc.component.editLocationInfo.locationObjId = _org.orgId;
                    vc.component.editLocationInfo.locationObjName = _org.allOrgName;
                }
            });
        },
        methods: {
            editLocationValidate: function() {
                return vc.validate.validate({
                    editLocationInfo: vc.component.editLocationInfo
                }, {
                    'editLocationInfo.locationName': [{
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
                    'editLocationInfo.locationType': [{
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
                    'editLocationInfo.locationId': [{
                        limit: "required",
                        param: "",
                        errInfo: "位置ID不能为空"
                    }]

                });
            },
            editLocation: function() {
                if ($that.editLocationInfo.locationType == '1000') { //小区
                    vc.component.editLocationInfo.locationObjId = vc.getCurrentCommunity().communityId;
                    vc.component.editLocationInfo.locationObjName = vc.getCurrentCommunity().name;
                }
                if (!vc.component.editLocationValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editLocationInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'communityLocation.updateCommunityLocation',
                    JSON.stringify(vc.component.editLocationInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editLocationModel').modal('hide');
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
            refreshEditLocationInfo: function() {
                vc.component.editLocationInfo = {
                    locationId: '',
                    locationName: '',
                    locationType: '',
                    locationObjId: '',
                    locationObjName: '',
                }

                vc.emit('editLocation', 'floorSelect2', 'clearFloor', {});
                vc.emit('editLocation', 'unitSelect2', 'clearUnit', {});
                vc.emit('editLocation', 'parkingBoxSelect2', 'clearParkingBox', {});
                vc.emit('editLocation', 'parkingAreaSelect2', 'clearParkingArea', {});
                vc.emit('editLocation', 'orgSelect2', 'clearOrg', {});
                vc.emit('editLocation', 'departmentSelect2', 'clearDepartment', {});
            }
        }
    });

})(window.vc, window.vc.component);