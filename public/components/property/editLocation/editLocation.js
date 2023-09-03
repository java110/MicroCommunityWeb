(function (vc, vm) {
    vc.extends({
        data: {
            editLocationInfo: {
                locationId: '',
                locationName: '',
                locationType: '',
                locationObjId: '',
                locationObjName: '',
                floorId: '',
                floors: [],
                unitId: '',
                units: [],
                paId: '',
                parkingAreas: [],
                boxId: '',
                parkingBoxs: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editLocation', 'openEditLocationModal', function (_params) {
                vc.component.refreshEditLocationInfo();
                vc.component._queryFloor();
                vc.component._queryParkingArea();
                vc.component._queryParkingBox();
                $('#editLocationModel').modal('show');
                vc.copyObject(_params, vc.component.editLocationInfo);
                vc.component.editLocationInfo.communityId = vc.getCurrentCommunity().communityId;
            });
            vc.on("editLocation", "notify", function (_param) {
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
            vc.on('editLocation', 'switchOrg', function (_org) {
                if ($that.editLocationInfo.locationType == '5000' && _org.allOrgName) { //部门
                    vc.component.editLocationInfo.locationObjId = _org.orgId;
                    vc.component.editLocationInfo.locationObjName = _org.allOrgName;
                }
            });
        },
        methods: {
            editLocationValidate: function () {
                return vc.validate.validate({
                    editLocationInfo: vc.component.editLocationInfo
                }, {
                    'editLocationInfo.locationName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "位置名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "位置名称不能超过100位"
                        }
                    ],
                    'editLocationInfo.locationType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "位置类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "位置类型 格式错误"
                        }
                    ],
                    'editLocationInfo.locationId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "位置ID不能为空"
                        }
                    ]
                });
            },
            editLocation: function () {
                if ($that.editLocationInfo.locationType == '1000') { //小区
                    vc.component.editLocationInfo.locationObjId = vc.getCurrentCommunity().communityId;
                    vc.component.editLocationInfo.locationObjName = vc.getCurrentCommunity().name;
                }
                if ($that.editLocationInfo.locationType == '2000') { //2000 单元
                    if ($that.editLocationInfo.floorId == null || $that.editLocationInfo.floorId == '' || $that.editLocationInfo.floorId == undefined) {
                        vc.toast("楼栋不能为空！");
                        return;
                    }
                    if ($that.editLocationInfo.unitId == null || $that.editLocationInfo.unitId == '' || $that.editLocationInfo.unitId == undefined) {
                        vc.toast("单元不能为空！");
                        return;
                    }
                }
                if ($that.editLocationInfo.locationType == '6000') { //6000 楼栋
                    if ($that.editLocationInfo.floorId == null || $that.editLocationInfo.floorId == '' || $that.editLocationInfo.floorId == undefined) {
                        vc.toast("楼栋不能为空！");
                        return;
                    }
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
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editLocationModel').modal('hide');
                            vc.emit('locationManage', 'listLocation', {});
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
            //查询楼栋
            _queryFloor: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 100
                    }
                };
                vc.http.apiGet(
                    '/floor.queryFloors',
                    param,
                    function (json, res) {
                        var listFloorData = JSON.parse(json);
                        vc.component.editLocationInfo.floors = listFloorData.apiFloorDataVoList;
                        vc.component._queryUnit(vc.component.editLocationInfo.floorId);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询单元
            _queryUnit: function (floorId, flag) {
                if (flag == '1') {
                    vc.component.editLocationInfo.unitId = "";
                }
                var param = {
                    params: {
                        floorId: floorId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 100
                    }
                };
                vc.http.apiGet('/unit.queryUnits',
                    param,
                    function (json, res) {
                        var listUnitData = JSON.parse(json);
                        vc.component.editLocationInfo.units = listUnitData;
                        if (listUnitData == null || listUnitData.length < 1) {
                            vc.component.editLocationInfo.unitId = "";
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询停车场
            _queryParkingArea: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 100
                    }
                };
                vc.http.apiGet('/parkingArea.listParkingAreas',
                    param,
                    function (json, res) {
                        var listParkingAreaData = JSON.parse(json);
                        vc.component.editLocationInfo.parkingAreas = listParkingAreaData.parkingAreas;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询岗亭
            _queryParkingBox: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 100
                    }
                };
                vc.http.apiGet('/parkingBox.listParkingBox',
                    param,
                    function (json, res) {
                        var listParkingBoxData = JSON.parse(json);
                        vc.component.editLocationInfo.parkingBoxs = listParkingBoxData.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditLocationInfo: function () {
                vc.component.editLocationInfo = {
                    locationId: '',
                    locationName: '',
                    locationType: '',
                    locationObjId: '',
                    locationObjName: '',
                    floorId: '',
                    floors: [],
                    unitId: '',
                    units: [],
                    paId: '',
                    parkingAreas: [],
                    boxId: '',
                    parkingBoxs: []
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