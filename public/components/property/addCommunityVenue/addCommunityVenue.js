(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCommunityVenueInfo: {
                venueId: '',
                name: '',
                remark: '',
                startTime: '',
                endTime: ''
            }
        },
        _initMethod: function () {
            //addSpaceStartTime
            vc.initHourMinute('addVenueStartTime', function (_value) {
                $that.addCommunityVenueInfo.startTime = _value;
            });
            vc.initHourMinute('addVenueEndTime', function (_value) {
                $that.addCommunityVenueInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('addCommunityVenue', 'openAddCommunityVenueModal', function () {
                $('#addCommunityVenueModel').modal('show');
            });
        },
        methods: {
            addCommunityVenueValidate() {
                return vc.validate.validate({
                    addCommunityVenueInfo: vc.component.addCommunityVenueInfo
                }, {
                    'addCommunityVenueInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "场馆名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "场馆名称不能超过30"
                        }
                    ],
                    'addCommunityVenueInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约开始时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约开始时间不能超过64"
                        }
                    ],
                    'addCommunityVenueInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约结束时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约结束时间不能超过64"
                        }
                    ],
                    'addCommunityVenueInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "描述不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述不能超过512"
                        }
                    ]
                });
            },
            saveCommunityVenueInfo: function () {
                if (!vc.component.addCommunityVenueValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addCommunityVenueInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/communityVenue.saveCommunityVenue',
                    JSON.stringify(vc.component.addCommunityVenueInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCommunityVenueModel').modal('hide');
                            vc.component.clearAddCommunityVenueInfo();
                            vc.emit('communitySpaceManage', 'listCommunityVenue', {});
                            vc.toast("添加成功");
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
            clearAddCommunityVenueInfo: function () {
                vc.component.addCommunityVenueInfo = {
                    name: '',
                    remark: '',
                    startTime: '',
                    endTime: ''
                };
            }
        }
    });
})(window.vc);