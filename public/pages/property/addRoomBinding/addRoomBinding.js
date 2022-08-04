/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            addRoomBindingInfo: {
                $step: {},
                index: 0,
                infos: []
            }
        },
        _initMethod: function () {
            vc.component._initStep();
        },
        _initEvent: function () {
            vc.on("addRoomBinding", "notify", function (_info) {
                _info.communityId = vc.getCurrentCommunity().communityId;
                vc.component.addRoomBindingInfo.infos[vc.component.addRoomBindingInfo.index] = _info;
            });
        },
        methods: {
            _initStep: function () {
                vc.component.addRoomBindingInfo.$step = $("#step");
                vc.component.addRoomBindingInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择楼", "选择单元", "添加房屋"]
                });
                vc.component.addRoomBindingInfo.index = vc.component.addRoomBindingInfo.$step.getIndex();
            },
            _prevStep: function () {
                vc.component.addRoomBindingInfo.$step.prevStep();
                vc.component.addRoomBindingInfo.index = vc.component.addRoomBindingInfo.$step.getIndex();
                vc.emit('viewFloorInfo', 'onIndex', vc.component.addRoomBindingInfo.index);
                vc.emit('viewUnitInfo', 'onIndex', vc.component.addRoomBindingInfo.index);
                vc.emit('addRoomView', 'onIndex', vc.component.addRoomBindingInfo.index);
            },
            _nextStep: function () {
                var _currentData = vc.component.addRoomBindingInfo.infos[vc.component.addRoomBindingInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                vc.component.addRoomBindingInfo.$step.nextStep();
                vc.component.addRoomBindingInfo.index = vc.component.addRoomBindingInfo.$step.getIndex();
                vc.emit('viewFloorInfo', 'onIndex', vc.component.addRoomBindingInfo.index);
                vc.emit('viewUnitInfo', 'onIndex', vc.component.addRoomBindingInfo.index);
                vc.emit('addRoomView', 'onIndex', vc.component.addRoomBindingInfo.index);
            },
            _finishStep: function () {
                var _currentData = vc.component.addRoomBindingInfo.infos[vc.component.addRoomBindingInfo.index];
                if ('' == vc.component.addRoomViewInfo.unitPrice || null == vc.component.addRoomViewInfo.unitPrice) {
                    vc.component.addRoomViewInfo.unitPrice = '0';
                }
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                if (parseInt(vc.component.viewUnitInfo.layerCount) < parseInt(vc.component.addRoomViewInfo.layer)) {
                    vc.toast('楼层不可超过' + vc.component.viewUnitInfo.layerCount);
                    return;
                }
                var param = {
                    data: vc.component.addRoomBindingInfo.infos
                }
                vc.http.apiPost(
                    '/room.addRoomBinding',
                    JSON.stringify(param), {
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
            _getFloorName: function () {
                var _tmpInfos = vc.component.addRoomBindingInfo.infos;
                for (var _tmpIndex = 0; _tmpIndex < _tmpInfos.length; _tmpIndex++) {
                    if (_tmpInfos[_tmpIndex].flowComponent == 'viewFloorInfo') {
                        return _tmpInfos[_tmpIndex].floorName;
                    }
                }
                return "";
            }
        }
    });
})(window.vc);