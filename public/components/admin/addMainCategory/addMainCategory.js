(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMainCategoryInfo: {
                mainCategoryId: '',
                categoryName: '',
                categoryType: '',
                startTime: '',
                endTime: '',
                categoryDesc: '',
                seq:''
            }
        },
        _initMethod: function () {
            vc.initDateTime('addStartTime', function (_value) {
                $that.addMainCategoryInfo.startTime = _value;
            });

            vc.initDateTime('addEndTime', function (_value) {
                $that.addMainCategoryInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('addMainCategory', 'openAddMainCategoryModal', function () {
                $('#addMainCategoryModel').modal('show');
            });
        },
        methods: {
            addMainCategoryValidate() {
                return vc.validate.validate({
                    addMainCategoryInfo: vc.component.addMainCategoryInfo
                }, {
                    'addMainCategoryInfo.categoryName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "目录名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "目录名称太长"
                        },
                    ],
                    'addMainCategoryInfo.categoryType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "目录类别不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "目录类别格式错误"
                        },
                    ],
                    'addMainCategoryInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "开始时间格式错误"
                        },
                    ],
                    'addMainCategoryInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "结束时间格式错误"
                        },
                    ],
                    'addMainCategoryInfo.categoryDesc': [
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
                    'addMainCategoryInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序必须是正整数"
                        },
                    ],




                });
            },
            saveMainCategoryInfo: function () {
                if (!vc.component.addMainCategoryValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addMainCategoryInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMainCategoryInfo);
                    $('#addMainCategoryModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/productCategory/saveMainCategory',
                    JSON.stringify(vc.component.addMainCategoryInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMainCategoryModel').modal('hide');
                            vc.component.clearAddMainCategoryInfo();
                            vc.emit('mainCategoryManage', 'listMainCategory', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMainCategoryInfo: function () {
                vc.component.addMainCategoryInfo = {
                    categoryName: '',
                    categoryType: '',
                    startTime: '',
                    endTime: '',
                    categoryDesc: '',
                    seq:''
                };
            }
        }
    });

})(window.vc);
