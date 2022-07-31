(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addInspectionItemInfo: {
                itemId: '',
                itemName: '',
                remark: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addInspectionItem', 'openAddInspectionItemModal', function() {
                $('#addInspectionItemModel').modal('show');
            });
        },
        methods: {
            addInspectionItemValidate() {
                return vc.validate.validate({
                    addInspectionItemInfo: vc.component.addInspectionItemInfo
                }, {
                    'addInspectionItemInfo.itemName': [{
                            limit: "required",
                            param: "",
                            errInfo: "巡检项目不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "巡检项目不能超过256"
                        },
                    ],
                    'addInspectionItemInfo.remark': [{
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            saveInspectionItemInfo: function() {
                if (!vc.component.addInspectionItemValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addInspectionItemInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addInspectionItemInfo);
                    $('#addInspectionItemModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/inspectionItem.saveInspectionItem',
                    JSON.stringify(vc.component.addInspectionItemInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addInspectionItemModel').modal('hide');
                            vc.component.clearAddInspectionItemInfo();
                            vc.emit('inspectionItemManage', 'listInspectionItem', {});
                            vc.toast('成功，请记得设置题目');
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddInspectionItemInfo: function() {
                vc.component.addInspectionItemInfo = {
                    itemName: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);