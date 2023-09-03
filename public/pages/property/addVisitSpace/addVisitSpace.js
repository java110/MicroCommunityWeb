/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            addVisitSpaceInfo: {
                vName: '',
                visitGender: '',
                phoneNumber: '',
                visitTime: vc.dateTimeFormat(new Date().getTime()),
                departureTime: '',
                carNum: '',
                entourage: 0,
                paId: '',
                psId: '',
                num: '',
                parkingSpaceNum: '',
                ownerId: '',
                ownerName: '',
                parkingAreas: [],
                parkingSpaces: [],
                visitCase: "",
                reasonType: "",
                reasonTypes: [],
                photo: "",
                visitPhotoUrl: "",
                communityId: vc.getCurrentCommunity().communityId,
                rooms: [],
                roomId: '',
            }
        },
        _initMethod: function () {
            vc.initDateTime('addVisitTime', function (_value) {
                $that.addVisitSpaceInfo.visitTime = _value;
            });
            vc.initDateTime('addDepartureTime', function (_value) {
                $that.addVisitSpaceInfo.departureTime = _value;
                let start = Date.parse(new Date($that.addVisitSpaceInfo.visitTime))
                let end = Date.parse(new Date($that.addVisitSpaceInfo.departureTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.addVisitSpaceInfo.departureTime = '';
                }
            });
            vc.getDict('s_visit_info', "reason_type", function (_data) {
                $that.addVisitSpaceInfo.reasonTypes = _data;
            });
            $that.checkFlow();
        },
        _initEvent: function () {
            vc.on('visitForOwner', 'ownerInfo', function (_info) {
                $that.addVisitSpaceInfo.ownerId = _info.ownerId;
                $that.addVisitSpaceInfo.ownerName = _info.name + "(" + _info.link + ")";
                $that._loadOwnerRoomInfo();
            });
            vc.on("addVisitSpace", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.addVisitSpaceInfo.photo = _param[0].fileId;
                    vc.component.addVisitSpaceInfo.visitPhotoUrl = _param[0].url;
                } else {
                    vc.component.addVisitSpaceInfo.photo = '';
                    vc.component.addVisitSpaceInfo.visitPhotoUrl = '';
                }
            });
        },
        methods: {
            _openSearchOwnerModel: function (_ownerId) {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            addVisitSpaceValidate() {
                return vc.validate.validate({
                    addVisitSpaceInfo: vc.component.addVisitSpaceInfo
                }, {
                    'addVisitSpaceInfo.vName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客姓名不能为空"
                        }
                    ],
                    'addVisitSpaceInfo.visitGender': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客性别不能为空"
                        }
                    ],
                    'addVisitSpaceInfo.entourage': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "随行人数有误"
                        }
                    ],
                    'addVisitSpaceInfo.phoneNumber': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客手机号不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "访客手机号不正确"
                        }
                    ],
                    'addVisitSpaceInfo.visitTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "访客时间格式错误"
                        }
                    ],
                    'addVisitSpaceInfo.departureTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "访客时间格式错误"
                        }
                    ],
                    'addVisitSpaceInfo.visitCase': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "拜访事由不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "拜访事由过长"
                        }
                    ],
                    'addVisitSpaceInfo.reasonType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "事由类型不能为空"
                        }
                    ],
                    'addVisitSpaceInfo.ownerId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访问业主不能为空"
                        }
                    ],
                    'addVisitSpaceInfo.roomId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访问房屋不能为空"
                        }
                    ]
                });
            },
            _addVisitFinish: function () {
                if (!vc.component.addVisitSpaceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if(vc.component.addVisitSpaceInfo.carNum && !vc.validate.carnumber(vc.component.addVisitSpaceInfo.carNum)){
                    vc.toast("车牌号有误");
                    return;
                }
                vc.http.apiPost(
                    '/visit.saveVisit',
                    JSON.stringify($that.addVisitSpaceInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast(_json.msg);
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
            checkFlow: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        auditWay: 'Y',
                        state: 'C',
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/visit.listVisitSetting',
                    param,
                    function (json, res) {
                        let _visitSettingManageInfo = JSON.parse(json);
                        if (_visitSettingManageInfo.data && _visitSettingManageInfo.data.length > 0) {
                            $that._loadStaffOrg(_visitSettingManageInfo.data[0].flowId);
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadStaffOrg: function (_flowId) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowId: _flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow.queryFirstAuditStaff',
                    param,
                    function (json, res) {
                        var _staffInfo = JSON.parse(json);
                        if (_staffInfo.code != 0) {
                            //vc.toast(_staffInfo.msg);
                            return;
                        }
                        let _data = _staffInfo.data;
                        if (_data[0].assignee == '-2') {
                            vc.toast('流程的第一审核人必须指定固定人(代理人)');
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadOwnerRoomInfo: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.addVisitSpaceInfo.ownerId 
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.addVisitSpaceInfo.rooms = _roomInfo.rooms;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);