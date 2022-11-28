(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addStorehouseInfo: {
                shId: '',
                shName: '',
                shType: '',
                shDesc: '',
                isShow: 'true',
                shTypes: []
            }
        },
        _initMethod: function () {
            vc.getDict('storehouse', "sh_type", function (_data) {
                // 根据登录用户的权限 显示可选择的仓库类型
                // 权限用户,显示所有仓库类型
                // 非权限用户,只显示2807小区仓库
                if (!vc.hasPrivilege('502021041902760001')) {
                    _data.forEach((item, index) => {
                        if (item.statusCd != "2807") {
                            _data.splice(index, 1);
                        }
                    })
                }
                vc.component.addStorehouseInfo.shTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('addStorehouse', 'openAddStorehouseModal', function () {
                $('#addStorehouseModel').modal('show');
            });
        },
        methods: {
            addStorehouseValidate() {
                return vc.validate.validate({
                    addStorehouseInfo: vc.component.addStorehouseInfo
                }, {
                    'addStorehouseInfo.shName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "仓库名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "仓库名称太长"
                        },
                    ],
                    'addStorehouseInfo.shType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "仓库类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "仓库类型格式错误"
                        },
                    ],
                    'addStorehouseInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "对外开放选框不能为空"
                        }
                    ],
                    'addStorehouseInfo.shDesc': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "描述不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述太长"
                        },
                    ],
                });
            },
            saveStorehouseInfo: function () {
                if (!vc.component.addStorehouseValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addStorehouseInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addStorehouseInfo);
                    $('#addStorehouseModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    'resourceStore.saveStorehouse',
                    JSON.stringify(vc.component.addStorehouseInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addStorehouseModel').modal('hide');
                            vc.component.clearAddStorehouseInfo();
                            vc.emit('storehouseManage', 'listStorehouse', {});
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
            clearAddStorehouseInfo: function () {
                vc.component.addStorehouseInfo.shName = '';
                vc.component.addStorehouseInfo.shType = '';
                vc.component.addStorehouseInfo.shDesc = '';
            }
        }
    });
})(window.vc);
