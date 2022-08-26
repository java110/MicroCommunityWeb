(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addParkingBoxAreaInfo: {
                boxId: '',
                boxName: '',
                defaultArea: '',
                remark: '',
                paId: '',
                parkingAreas: []
            }
        },
        _initMethod: function() {
            $that._loadAddParkingBoxAreas();
        },
        _initEvent: function() {
            vc.on('addParkingBoxArea', 'openAddParkingBoxAreaModal', function(_param) {
                $that.addParkingBoxAreaInfo.boxId = _param.boxId;
                $('#addParkingBoxAreaModel').modal('show');
            });
        },
        methods: {
            addParkingBoxAreaValidate() {
                return vc.validate.validate({
                    addParkingBoxAreaInfo: vc.component.addParkingBoxAreaInfo
                }, {
                    'addParkingBoxAreaInfo.paId': [{
                        limit: "required",
                        param: "",
                        errInfo: "停车场不能为空"
                    }],
                    'addParkingBoxAreaInfo.defaultArea': [{
                        limit: "required",
                        param: "",
                        errInfo: "默认停车场不能为空"
                    }]
                });
            },
            saveParkingBoxInfo: function() {
                if (!vc.component.addParkingBoxAreaValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addParkingBoxAreaInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/parkingBoxArea.saveParkingBoxArea',
                    JSON.stringify(vc.component.addParkingBoxAreaInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addParkingBoxAreaModel').modal('hide');
                            vc.component.clearAddParkingBoxAreaInfo();
                            vc.emit('parkingBoxAreaManage', 'listParkingBoxArea', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            _loadAddParkingBoxAreas: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function(json, res) {
                        let _parkingAreaManageInfo = JSON.parse(json);
                        $that.addParkingBoxAreaInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            clearAddParkingBoxAreaInfo: function() {
                let _parkingAreas = $that.addParkingBoxAreaInfo.parkingAreas;
                let _boxId = $that.addParkingBoxAreaInfo.boxId;
                let _boxName = $that.addParkingBoxAreaInfo.boxName;
                vc.component.addParkingBoxAreaInfo = {
                    boxId: _boxId,
                    boxName: _boxName,
                    defaultArea: '',
                    remark: '',
                    paId: '',
                    parkingAreas: _parkingAreas
                };
            }
        }
    });
})(window.vc);