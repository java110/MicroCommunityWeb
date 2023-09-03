(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        propTypes: {
            notifyLoadDataComponentName: vc.propTypes.string
        },
        data: {
            batchAddParkingSpaceInfo: {
                startNum: '',
                endNum: '',
                preNum: '',
                paId: '',
                area: '1',
                remark: '',
                psId: '',
                parkingType: '1',
                parkingTypes: [],
                parkingAreas: []
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('parking_space', "parking_type", function (_data) {
                vc.component.batchAddParkingSpaceInfo.parkingTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('batchAddParkingSpace', 'openAddParkingSpaceModal', function () {
                $that._loadBatchAddParkingAreas();
                $('#batchAddParkingSpaceModel').modal('show');
            });
        },
        methods: {
            batchAddParkingSpaceValidate() {
                return vc.validate.validate({
                    batchAddParkingSpaceInfo: vc.component.batchAddParkingSpaceInfo
                }, {
                    'batchAddParkingSpaceInfo.startNum': [{
                        limit: "required",
                        param: "",
                        errInfo: "开始编号不能为空"
                    },
                    ],
                    'batchAddParkingSpaceInfo.endNum': [{
                        limit: "required",
                        param: "",
                        errInfo: "结束编号不能为空"
                    },
                    ],
                    'batchAddParkingSpaceInfo.paId': [{
                        limit: "required",
                        param: "",
                        errInfo: "停车场不能为空"
                    }],
                    'batchAddParkingSpaceInfo.parkingType': [{
                        limit: "required",
                        param: "",
                        errInfo: "车位类型不能为空"
                    }],
                });
            },
            _batchSaveParkingSpaceInfo: function () {
                if (!vc.component.batchAddParkingSpaceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.batchAddParkingSpaceInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/parkingSpace.batchSaveParkingSpace',
                    JSON.stringify(vc.component.batchAddParkingSpaceInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#batchAddParkingSpaceModel').modal('hide');
                            vc.component.clearAddParkingSpaceInfo();
                            vc.toast("添加成功");
                            vc.emit($props.notifyLoadDataComponentName, 'listParkingSpaceData', {});
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearBatchAddParkingSpaceInfo: function () {
                let _parkingTypes = $that.batchAddParkingSpaceInfo.parkingTypes;
                vc.component.batchAddParkingSpaceInfo = {
                    startNum: '',
                    endNum: '',
                    preNum: '',
                    paId: '',
                    area: '1',
                    remark: '',
                    psId: '',
                    parkingType: '1',
                    parkingTypes: _parkingTypes,
                    parkingAreas: []
                }
            },
            _loadBatchAddParkingAreas: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function (json, res) {
                        let _parkingAreaManageInfo = JSON.parse(json);
                        $that.batchAddParkingSpaceInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });
})(window.vc);