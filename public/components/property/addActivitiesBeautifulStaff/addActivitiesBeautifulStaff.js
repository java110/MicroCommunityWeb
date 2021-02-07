(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addActivitiesBeautifulStaffInfo: {
                beId: '',
                ruleId: '',
                staffId: '',
                activitiesNum: '',
                workContent: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addActivitiesBeautifulStaff', 'openAddActivitiesBeautifulStaffModal', function () {
                $('#addActivitiesBeautifulStaffModel').modal('show');
            });
        },
        methods: {
            addActivitiesBeautifulStaffValidate() {
                return vc.validate.validate({
                    addActivitiesBeautifulStaffInfo: vc.component.addActivitiesBeautifulStaffInfo
                }, {
                    'addActivitiesBeautifulStaffInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动规则不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "活动规则格式错误"
                        },
                    ],
                    'addActivitiesBeautifulStaffInfo.staffId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "员工名称太长"
                        },
                    ],
                    'addActivitiesBeautifulStaffInfo.activitiesNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工编号不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "编号必须为数字"
                        },
                    ],
                    'addActivitiesBeautifulStaffInfo.workContent': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "工作简介不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1024",
                            errInfo: "工作简介说明太长"
                        },
                    ],




                });
            },
            saveActivitiesBeautifulStaffInfo: function () {
                if (!vc.component.addActivitiesBeautifulStaffValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addActivitiesBeautifulStaffInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addActivitiesBeautifulStaffInfo);
                    $('#addActivitiesBeautifulStaffModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'activitiesBeautifulStaff.saveActivitiesBeautifulStaff',
                    JSON.stringify(vc.component.addActivitiesBeautifulStaffInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addActivitiesBeautifulStaffModel').modal('hide');
                            vc.component.clearAddActivitiesBeautifulStaffInfo();
                            vc.emit('activitiesBeautifulStaffManage', 'listActivitiesBeautifulStaff', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddActivitiesBeautifulStaffInfo: function () {
                vc.component.addActivitiesBeautifulStaffInfo = {
                    ruleId: '',
                    staffId: '',
                    activitiesNum: '',
                    workContent: '',

                };
            }
        }
    });

})(window.vc);
