(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCommunitySpacePersonInfo: {
                cspId: '',
                spaceId: '',
                personName: '',
                personTel: '',
                appointmentTime: '',
                receivableAmount: '',
                receivedAmount: '',
                payWay: '',
                state: 'S',
                remark: '',
                openTimes:[],
                spaces: []
            }
        },
        _initMethod: function() {

            vc.initDate('addAppointmentDate', function(_value) {
                $that.addCommunitySpacePersonInfo.appointmentTime = _value;
            });

        },
        _initEvent: function() {
            vc.on('addCommunitySpacePerson', 'openAddCommunitySpacePersonModal', function(_param) {
                $that._listAddCommunitySpacePersonCommunitySpaces();
                $('#addCommunitySpacePersonModel').modal('show');
            });
        },
        methods: {
            addCommunitySpacePersonValidate() {
                return vc.validate.validate({
                    addCommunitySpacePersonInfo: vc.component.addCommunitySpacePersonInfo
                }, {
                    'addCommunitySpacePersonInfo.spaceId': [{
                            limit: "required",
                            param: "",
                            errInfo: "场地ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "场地ID不能超过30"
                        },
                    ],
                    'addCommunitySpacePersonInfo.personName': [{
                            limit: "required",
                            param: "",
                            errInfo: "预约人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约人不能超过64"
                        },
                    ],
                    'addCommunitySpacePersonInfo.personTel': [{
                            limit: "required",
                            param: "",
                            errInfo: "预约电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "预约电话不能超过11"
                        },
                    ],
                    'addCommunitySpacePersonInfo.appointmentTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "预约时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约时间不能超过64"
                        },
                    ],
                    'addCommunitySpacePersonInfo.receivableAmount': [{
                            limit: "required",
                            param: "",
                            errInfo: "应收金额不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "应收金额不能超过10"
                        },
                    ],
                    'addCommunitySpacePersonInfo.receivedAmount': [{
                            limit: "required",
                            param: "",
                            errInfo: "实收金额不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "实收金额不能超过10"
                        },
                    ],
                    'addCommunitySpacePersonInfo.payWay': [{
                            limit: "required",
                            param: "",
                            errInfo: "支付方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "支付方式不能超过12"
                        },
                    ],
                    'addCommunitySpacePersonInfo.state': [{
                            limit: "required",
                            param: "",
                            errInfo: "state不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "state不能超过12"
                        },
                    ],
                    'addCommunitySpacePersonInfo.remark': [{
                            limit: "required",
                            param: "",
                            errInfo: "remark不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "remark不能超过512"
                        },
                    ],
                });
            },
            _chanageAddCommunitySpace:function(){

                $that.addCommunitySpacePersonInfo.spaces.forEach(item=>{
                    if(item.spaceId == $that.addCommunitySpacePersonInfo.spaceId){
                        $that.addCommunitySpacePersonInfo.openTimes = item.openTimes;
                    }
                })
            },
            saveCommunitySpacePersonInfo: function() {
                if (!vc.component.addCommunitySpacePersonValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.addCommunitySpacePersonInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addCommunitySpacePersonInfo);
                    $('#addCommunitySpacePersonModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/communitySpace.saveCommunitySpacePerson',
                    JSON.stringify(vc.component.addCommunitySpacePersonInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCommunitySpacePersonModel').modal('hide');
                            vc.component.clearAddCommunitySpacePersonInfo();
                            vc.emit('communitySpacePersonManage', 'listCommunitySpacePerson', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddCommunitySpacePersonInfo: function() {
                vc.component.addCommunitySpacePersonInfo = {
                    cspId: '',
                    spaceId: '',
                    personName: '',
                    personTel: '',
                    appointmentTime: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    payWay: '',
                    state: 'S',
                    remark: '',
                    openTimes:[],
                    spaces: []
                };
            },
            _listAddCommunitySpacePersonCommunitySpaces: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/communitySpace.listCommunitySpace',
                    param,
                    function(json, res) {
                        let _communitySpaceManageInfo = JSON.parse(json);

                        vc.component.addCommunitySpacePersonInfo.spaces = _communitySpaceManageInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _chanageAddCommunitySpaceAppointmentTime: function(_page, _rows) {

                if(!$that.addCommunitySpacePersonInfo.spaceId){
                    return ;
                }
                let param = {
                    params: {
                        spaceId: $that.addCommunitySpacePersonInfo.spaceId,
                        appointmentTime: $that.addCommunitySpacePersonInfo.appointmentTime,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/communitySpace.listCommunitySpaceOpenTime',
                    param,
                    function(json, res) {
                        let _communitySpaceManageInfo = JSON.parse(json);

                        vc.component.addCommunitySpacePersonInfo.openTimes = _communitySpaceManageInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);