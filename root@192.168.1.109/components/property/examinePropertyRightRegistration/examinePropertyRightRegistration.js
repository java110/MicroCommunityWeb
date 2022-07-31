(function (vc) {
    vc.extends({
        data: {
            examinePropertyRightRegistrationInfo: {
                states: [],
                state: '',
                prrId: '',
                roomId: '',
                roomNum: '',
                unitNum: '',
                floorNum: '',
                allNum: '',
                name: '',
                link: '',
                idCard: '',
                address: '',
                remark: '',
                flag: "1",
                communityId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('examinePropertyRightRegistration', 'openExaminePropertyRightRegistrationModal', function (_param) {
                //与字典表费用类型关联
                vc.getDict('property_right_registration', "state", function (_data) {
                    vc.component.examinePropertyRightRegistrationInfo.states = _data;
                });
                $that.clearExaminePropertyRightRegistrationInfo();
                $that.examinePropertyRightRegistrationInfo.prrId = _param.prrId;
                $that.examinePropertyRightRegistrationInfo.remark = _param.remark;
                $that.examinePropertyRightRegistrationInfo.state = _param.state;
                if($that.examinePropertyRightRegistrationInfo.state == '0'){
                    $that.examinePropertyRightRegistrationInfo.state = "";
                }
                $that.examinePropertyRightRegistrationInfo.roomNum = _param.roomNum;
                $that.examinePropertyRightRegistrationInfo.unitNum = _param.unitNum;
                $that.examinePropertyRightRegistrationInfo.floorNum = _param.floorNum;
                $that.examinePropertyRightRegistrationInfo.allNum = _param.floorNum + "-" + _param.unitNum + "-" + _param.roomNum;
                $that.examinePropertyRightRegistrationInfo.name = _param.name;
                $that.examinePropertyRightRegistrationInfo.link = _param.link;
                $that.examinePropertyRightRegistrationInfo.idCard = _param.idCard;
                $that.examinePropertyRightRegistrationInfo.address = _param.address;
                $that.examinePropertyRightRegistrationInfo.roomId = _param.roomId;
                $('#examinePropertyRightRegistrationModel').modal('show');
            });
        },
        methods: {
            examinePropertyRightRegistrationValidate() {
                return vc.validate.validate({
                    examinePropertyRightRegistrationInfo: vc.component.examinePropertyRightRegistrationInfo
                }, {
                    'examinePropertyRightRegistrationInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        }
                    ]
                });
            },
            saveExaminePropertyRightRegistrationInfo: function () {
                if (!vc.component.examinePropertyRightRegistrationValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.examinePropertyRightRegistrationInfo.communityId = vc.getCurrentCommunity().communityId;
                if (vc.component.examinePropertyRightRegistrationInfo.remark != null && vc.component.examinePropertyRightRegistrationInfo.remark !== ''
                    && vc.component.examinePropertyRightRegistrationInfo.remark !== 'undefined') {
                    vc.component.examinePropertyRightRegistrationInfo.remark = vc.component.examinePropertyRightRegistrationInfo.remark.trim();
                }
                vc.http.apiPost(
                    'propertyRightRegistration.updatePropertyRightRegistration',
                    JSON.stringify(vc.component.examinePropertyRightRegistrationInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#examinePropertyRightRegistrationModel').modal('hide');
                            vc.component.clearExaminePropertyRightRegistrationInfo();
                            vc.emit('propertyRightRegistrationManage', 'listPropertyRightRegistration', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearExaminePropertyRightRegistrationInfo: function () {
                vc.component.examinePropertyRightRegistrationInfo = {
                    state: '',
                    states: [],
                    prrId: '',
                    roomId: '',
                    roomNum: '',
                    unitNum: '',
                    floorNum: '',
                    allNum: '',
                    name: '',
                    link: '',
                    idCard: '',
                    address: '',
                    remark: '',
                    flag: "1",
                    communityId: ''
                };
            },
        }
    });
})(window.vc);
