(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addBasePrivilegeInfo: {
                pId: '',
                name: '',
                resource: '',
                domain: '',
                description: '',
                mId:''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addBasePrivilege', 'openAddBasePrivilegeModal', function (_item) {
                $that.addBasePrivilegeInfo.mId = _item.mId;
                $('#addBasePrivilegeModel').modal('show');
            });
        },
        methods: {
            addBasePrivilegeValidate() {
                return vc.validate.validate({
                    addBasePrivilegeInfo: vc.component.addBasePrivilegeInfo
                }, {
                    'addBasePrivilegeInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "权限名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,10",
                            errInfo: "权限名称必须在2至10字符之间"
                        },
                    ],
                    'addBasePrivilegeInfo.resource': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "资源路径不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,200",
                            errInfo: "资源路径必须在1至200字符之间"
                        },
                    ],
                    'addBasePrivilegeInfo.domain': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商户类型不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,12",
                            errInfo: "商户类型错误"
                        },
                    ],
                    'addBasePrivilegeInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ],
                    'addBasePrivilegeInfo.mId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "非法操作，菜单为空"
                        }
                    ],


                });
            },
            saveBasePrivilegeInfo: function () {
                if (!vc.component.addBasePrivilegeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addBasePrivilegeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addBasePrivilegeInfo);
                    $('#addBasePrivilegeModel').modal('hide');
                    return;
                }

                vc.http.post(
                    'addBasePrivilege',
                    'save',
                    JSON.stringify(vc.component.addBasePrivilegeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addBasePrivilegeModel').modal('hide');
                            vc.component.clearAddBasePrivilegeInfo();
                            vc.emit('basePrivilegeManage', 'listBasePrivilege', {});

                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddBasePrivilegeInfo: function () {
                vc.component.addBasePrivilegeInfo = {
                    name: '',
                    domain: '',
                    description: '',

                };
            }
        }
    });

})(window.vc);
