(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCommunitySpaceInfo: {
                spaceId: '',
                name: '',
                startTime: '00:00',
                endTime: '23:59',
                feeMoney: '',
                adminName: '',
                tel: '',
                state: '',
                venueId: ''
            }
        },
        _initMethod: function () {
            //addSpaceStartTime
            // vc.initHourMinute('addSpaceStartTime', function(_value) {
            //     $that.addCommunitySpaceInfo.startTime = _value;
            // });

            // vc.initHourMinute('addSpaceEndTime', function(_value) {
            //     $that.addCommunitySpaceInfo.endTime = _value;
            // });
        },
        _initEvent: function () {
            vc.on('addCommunitySpace', 'openAddCommunitySpaceModal', function (_param) {
                $that.addCommunitySpaceInfo.venueId = _param.venueId;
                $('#addCommunitySpaceModel').modal('show');
            });
        },
        methods: {
            addCommunitySpaceValidate() {
                return vc.validate.validate({
                    addCommunitySpaceInfo: vc.component.addCommunitySpaceInfo
                }, {
                    'addCommunitySpaceInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "名称不能超过50"
                        }
                    ],
                    'addCommunitySpaceInfo.startTime': [
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
                    'addCommunitySpaceInfo.endTime': [
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
                    'addCommunitySpaceInfo.feeMoney': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "每小时费用不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "每小时费用不能超过10"
                        }
                    ],
                    'addCommunitySpaceInfo.adminName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "管理员不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "管理员不能超过64"
                        }
                    ],
                    'addCommunitySpaceInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "管理员电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "管理员电话不能超过11"
                        }
                    ],
                    'addCommunitySpaceInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "状态不能超过12"
                        }
                    ]
                });
            },
            saveCommunitySpaceInfo: function () {
                if (!vc.component.addCommunitySpaceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addCommunitySpaceInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addCommunitySpaceInfo);
                    $('#addCommunitySpaceModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/communitySpace.saveCommunitySpace',
                    JSON.stringify(vc.component.addCommunitySpaceInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCommunitySpaceModel').modal('hide');
                            vc.component.clearAddCommunitySpaceInfo();
                            vc.emit('communitySpaceManage', 'listCommunitySpace', {});
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
            clearAddCommunitySpaceInfo: function () {
                vc.component.addCommunitySpaceInfo = {
                    name: '',
                    startTime: '00:00',
                    endTime: '23:59',
                    feeMoney: '',
                    adminName: '',
                    tel: '',
                    state: '',
                    venueId: ''
                };
            }
        }
    });
})(window.vc);