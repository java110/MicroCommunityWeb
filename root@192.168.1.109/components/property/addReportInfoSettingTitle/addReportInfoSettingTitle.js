(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReportInfoSettingTitleInfo: {
                titleId: '0000',
                titleType: '',
                title: '',
                seq: '',
                settingId: '',
                titleValues: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addReportInfoSettingTitle', 'openAddReportInfoSettingTitleModal', function (_param) {
                vc.copyObject(_param, $that.addReportInfoSettingTitleInfo);
                $('#addReportInfoSettingTitleModel').modal('show');
                console.log($that.addReportInfoSettingTitleInfo);
            });
        },
        methods: {
            addReportInfoSettingTitleValidate() {
                return vc.validate.validate({
                    addReportInfoSettingTitleInfo: vc.component.addReportInfoSettingTitleInfo
                }, {
                    'addReportInfoSettingTitleInfo.titleType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "题目类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "题目类型格式错误"
                        },
                    ],
                    'addReportInfoSettingTitleInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "问卷题目不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "问卷题目太长"
                        },
                    ],
                    'addReportInfoSettingTitleInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "顺序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "顺序必须是数字"
                        },
                    ]
                });
            },
            saveReportInfoSettingTitleInfo: function () {
                if (!vc.component.addReportInfoSettingTitleValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                vc.component.addReportInfoSettingTitleInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addReportInfoSettingTitleInfo);
                    $('#addReportInfoSettingTitleModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/reportInfoSettingTitle/saveReportInfoSettingTitle',
                    JSON.stringify(vc.component.addReportInfoSettingTitleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReportInfoSettingTitleModel').modal('hide');
                            vc.component.clearAddReportInfoSettingTitleInfo();
                            vc.emit('reportInfoSettingTitleManage', 'listReportInfoSettingTitle', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddReportInfoSettingTitleInfo: function () {
                vc.component.addReportInfoSettingTitleInfo = {
                    titleId: '',
                    titleType: '',
                    title: '',
                    seq: '',
                    settingId: '',
                    titleValues: []
                };
            },
            _changeAddTitleType: function () {

                let _titleType = $that.addReportInfoSettingTitleInfo.titleType;

                if (_titleType == '3003') {
                    $that.addReportInfoSettingTitleInfo.titleValues = [];
                    return;
                }

                $that.addReportInfoSettingTitleInfo.titleValues = [
                    {
                        qaValue: '',
                        seq: 1
                    }
                ];
            },
            _addTitleValue: function () {
                $that.addReportInfoSettingTitleInfo.titleValues.push(
                    {
                        qaValue: '',
                        seq: $that.addReportInfoSettingTitleInfo.titleValues.length + 1
                    }
                );
            },
            _deleteTitleValue: function (_seq) {
                console.log(_seq);

                let _newTitleValues = [];
                let _tmpTitleValues = $that.addReportInfoSettingTitleInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            qaValue: item.qaValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });

                $that.addReportInfoSettingTitleInfo.titleValues = _newTitleValues;
            }
        }
    });

})(window.vc);
