/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            newVisitInfo: {
                $step: {},
                index: 0,
                infos: [],
            }
        },
        _initMethod: function () {
            vc.component._initStep();
        },
        _initEvent: function () {
            vc.on("addVisitSpace", "notify", function (_info) {
                vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index] = _info;
            });
            vc.on("addVisitSpace", "ownerId", function (_ownerId) {
                vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index] = [];
                vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index]["ownerId"] = _ownerId;
            });
            vc.on("addVisitSpace", "visitCase", function (_visitCase) {
                if (!_visitCase) {
                    vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index] = null;
                    return;
                }
                vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index] = [];
                vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index]["visitCase"] = _visitCase.visitCase;
                vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index]["reasonType"] = _visitCase.reasonType;
                vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index]["visitPhoto"] = _visitCase.visitPhoto;
                vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index]["videoPlaying"] = _visitCase.videoPlaying;
            });
        },
        methods: {
            _initStep: function () {
                vc.component.newVisitInfo.$step = $("#step");
                vc.component.newVisitInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["新增访客", "选择目标业主", "填写拜访事由"]
                });
                vc.component.newVisitInfo.index = vc.component.newVisitInfo.$step.getIndex();
            },
            _prevStep: function () {
                vc.component.newVisitInfo.$step.prevStep();
                vc.component.newVisitInfo.index = vc.component.newVisitInfo.$step.getIndex();
                vc.emit('addVisit', 'onIndex', vc.component.newVisitInfo.index);
                vc.emit('visitForOwner', 'onIndex', vc.component.newVisitInfo.index);
                vc.emit('addVisitCase', 'onIndex', vc.component.newVisitInfo.index);
                // if(vc.component.newVisitInfo.index == 1){
                //     vc.emit('viewOwnerInfo','callBackOwnerInfo',{});
                // }
            },
            _nextStep: function () {
                var _currentData = vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息", 1000);
                    return;
                }
                vc.component.newVisitInfo.$step.nextStep();
                vc.component.newVisitInfo.index = vc.component.newVisitInfo.$step.getIndex();
                vc.emit('addVisit', 'onIndex', vc.component.newVisitInfo.index);
                vc.emit('visitForOwner', 'onIndex', vc.component.newVisitInfo.index);
                vc.emit('addVisitCase', 'onIndex', vc.component.newVisitInfo.index);
                // if(vc.component.newVisitInfo.index == 1){
                //     vc.emit('viewOwnerInfo','callBackOwnerInfo',{});
                // }
            },
            _addVisitFinish: function () {
                var _currentData = vc.component.newVisitInfo.infos[vc.component.newVisitInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息", 1000);
                    return;
                }
                vc.component.newVisitInfo.infos[0]['communityId'] = vc.getCurrentCommunity().communityId;
                var param = {
                    vName: vc.component.newVisitInfo.infos[0]['vName'],
                    visitGender: vc.component.newVisitInfo.infos[0]['visitGender'],
                    phoneNumber: vc.component.newVisitInfo.infos[0]['phoneNumber'],
                    communityId: vc.component.newVisitInfo.infos[0]['communityId'],
                    visitTime: vc.component.newVisitInfo.infos[0]['visitTime'],
                    departureTime: vc.component.newVisitInfo.infos[0]['departureTime'],
                    carNum: vc.component.newVisitInfo.infos[0]['carNum'],
                    entourage: vc.component.newVisitInfo.infos[0]['entourage'],
                    paId: vc.component.newVisitInfo.infos[0]['paId'],
                    psId: vc.component.newVisitInfo.infos[0]['psId'],
                    ownerId: vc.component.newVisitInfo.infos[1]['ownerId'],
                    visitCase: vc.component.newVisitInfo.infos[2]['visitCase'],
                    photo: vc.component.newVisitInfo.infos[2]['visitPhoto'],
                    videoPlaying: vc.component.newVisitInfo.infos[2]['videoPlaying'],
                    reasonType: vc.component.newVisitInfo.infos[2]['reasonType']
                }
                vc.http.apiPost(
                    '/visit.saveVisit',
                    JSON.stringify(param), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        // 清除已填写信息
                        vc.component.newVisitInfo.infos = [];
                        vc.emit('viewVisitInfo', 'clearInfo', '');
                        vc.emit('addVisit', 'clearInfo', '');
                        vc.emit('visitForOwner', 'clearInfo', '');
                        vc.emit('addVisitCase', 'clearInfo', '');
                        if (res.status == 200 && _json.code == '0') {
                            //关闭model
                            vc.toast("添加成功");
                            vc.goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _goBack: function (_param) {
                vc.goBack();
            }
        }
    });
})(window.vc);