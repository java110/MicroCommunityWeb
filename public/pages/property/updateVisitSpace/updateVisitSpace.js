/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            updateVisitSpaceInfo: {
                vId: '',
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
            $that.updateVisitSpaceInfo.vId = vc.getParam('vId');
            vc.initDateTime('updateVisitTime', function (_value) {
                $that.updateVisitSpaceInfo.visitTime = _value;
            });
            vc.initDateTime('updateDepartureTime', function (_value) {
                $that.updateVisitSpaceInfo.departureTime = _value;
                let start = Date.parse(new Date($that.updateVisitSpaceInfo.visitTime))
                let end = Date.parse(new Date($that.updateVisitSpaceInfo.departureTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.updateVisitSpaceInfo.departureTime = '';
                }
            });
            vc.getDict('s_visit_info', "reason_type", function (_data) {
                $that.updateVisitSpaceInfo.reasonTypes = _data;
            });
            $that._listVisit();
        },
        _initEvent: function () {
            vc.on('visitForOwner', 'ownerInfo', function (_info) {
                $that.updateVisitSpaceInfo.ownerId = _info.ownerId;
                $that.updateVisitSpaceInfo.ownerName = _info.name + "(" + _info.link + ")";
                $that._loadOwnerRoomInfo();
            });
            vc.on("updateVisitSpace", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.updateVisitSpaceInfo.photo = _param[0].fileId;
                    vc.component.updateVisitSpaceInfo.visitPhotoUrl = _param[0].url;
                } else {
                    vc.component.updateVisitSpaceInfo.photo = '';
                    vc.component.updateVisitSpaceInfo.visitPhotoUrl = '';
                }
            });
        },
        methods: {
            _openSearchOwnerModel: function (_ownerId) {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            updateVisitSpaceValidate() {
                return vc.validate.validate({
                    updateVisitSpaceInfo: vc.component.updateVisitSpaceInfo
                }, {
                    'updateVisitSpaceInfo.vName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客姓名不能为空"
                        }
                    ],
                    'updateVisitSpaceInfo.visitGender': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客性别不能为空"
                        }
                    ],
                    'updateVisitSpaceInfo.entourage': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "随行人数有误"
                        }
                    ],
                    'updateVisitSpaceInfo.phoneNumber': [
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
                    'updateVisitSpaceInfo.visitTime': [
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
                    'updateVisitSpaceInfo.departureTime': [
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
                    'updateVisitSpaceInfo.visitCase': [
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
                    'updateVisitSpaceInfo.reasonType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "事由类型不能为空"
                        }
                    ],
                    'updateVisitSpaceInfo.ownerId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访问业主不能为空"
                        }
                    ],
                    'updateVisitSpaceInfo.roomId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访问房屋不能为空"
                        }
                    ]
                });
            },
            _updateVisitFinish: function () {
                if (!vc.component.updateVisitSpaceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if(vc.component.updateVisitSpaceInfo.carNum && !vc.validate.carnumber(vc.component.updateVisitSpaceInfo.carNum)){
                    vc.toast("车牌号有误");
                    return;
                }
                vc.http.apiPost(
                    '/visit.updateVisit',
                    JSON.stringify($that.updateVisitSpaceInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast("修改成功");
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
            _listVisit: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        vId: $that.updateVisitSpaceInfo.vId,
                        communityId: vc.getCurrentCommunity().communityId,
                        channel: 'PC'
                    }
                };
                //发送get请求
                vc.http.apiGet('/visit.listVisits',
                    param,
                    function (json, res) {
                        let _visitDetailInfo = JSON.parse(json);
                        if (_visitDetailInfo.visits != null && _visitDetailInfo.visits != '' && _visitDetailInfo.visits != undefined && _visitDetailInfo.visits.length > 0) {
                            vc.copyObject(_visitDetailInfo.visits[0], $that.updateVisitSpaceInfo);
                            $that.updateVisitSpaceInfo.photo = _visitDetailInfo.visits[0].url;
                        }
                        let _photos = [];
                        _photos.push($that.updateVisitSpaceInfo.photo);
                        vc.emit('updateVisitSpace', 'uploadImageUrl', 'notifyPhotos', _photos);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadOwnerRoomInfo: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.updateVisitSpaceInfo.ownerId 
                    }
                };
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.updateVisitSpaceInfo.rooms = _roomInfo.rooms;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);