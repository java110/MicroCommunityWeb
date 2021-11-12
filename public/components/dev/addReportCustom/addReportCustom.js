(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReportCustomInfo: {
                groupId: '',
                title: '',
                seq: '',
                remark: '',
                reportCustomGroups:[]

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addReportCustom', 'openAddReportCustomModal', function () {
                $that._listAddReportCustomGroups();
                $('#addReportCustomModel').modal('show');
            });
        },
        methods: {
            addReportCustomValidate() {
                return vc.validate.validate({
                    addReportCustomInfo: vc.component.addReportCustomInfo
                }, {
                    'addReportCustomInfo.groupId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "组编号不能超过30"
                        },
                    ],
                    'addReportCustomInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "选项标题不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "选项标题不能超过64"
                        },
                    ],
                    'addReportCustomInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "排序不能超过11"
                        },
                    ],
                    'addReportCustomInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述不能超过512"
                        },
                    ],




                });
            },
            saveReportCustomInfo: function () {
                if (!vc.component.addReportCustomValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addReportCustomInfo);
                    $('#addReportCustomModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/reportCustom.saveReportCustom',
                    JSON.stringify(vc.component.addReportCustomInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReportCustomModel').modal('hide');
                            vc.component.clearAddReportCustomInfo();
                            vc.emit('reportCustomManage', 'listReportCustom', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddReportCustomInfo: function () {
                vc.component.addReportCustomInfo = {
                    customId: '',
                    groupId: '',
                    title: '',
                    seq: '',
                    remark: '',
                    reportCustomGroups:[]
                };
            },
            _listAddReportCustomGroups: function (_page, _rows) {
                var param = {
                    params: {
                        page:1,
                        row:50
                    }
                };

                //发送get请求
                vc.http.apiGet('/reportCustomGroup.listReportCustomGroup',
                    param,
                    function (json, res) {
                        var _reportCustomGroupManageInfo = JSON.parse(json);
                       $that.addReportCustomInfo.reportCustomGroups = _reportCustomGroupManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportCustomGroupManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
