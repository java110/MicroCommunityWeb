(function (vc, vm) {

    vc.extends({
        data: {
            editMainCategoryInfo: {
                mainCategoryId: '',
                categoryName: '',
                categoryType: '',
                startTime: '',
                endTime: '',
                categoryDesc: '',
                seq: ''
            }
        },
        _initMethod: function () {
            vc.initDateTime('editStartTime', function (_value) {
                $that.editMainCategoryInfo.startTime = _value;
            });

            vc.initDateTime('editEndTime', function (_value) {
                $that.editMainCategoryInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('editMainCategory', 'openEditMainCategoryModal', function (_params) {
                vc.component.refreshEditMainCategoryInfo();
                $('#editMainCategoryModel').modal('show');
                vc.copyObject(_params, vc.component.editMainCategoryInfo);
                vc.component.editMainCategoryInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editMainCategoryValidate: function () {
                return vc.validate.validate({
                    editMainCategoryInfo: vc.component.editMainCategoryInfo
                }, {
                    'editMainCategoryInfo.categoryName': [
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
                    'editMainCategoryInfo.categoryType': [
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
                    'editMainCategoryInfo.startTime': [
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
                    'editMainCategoryInfo.endTime': [
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
                    'editMainCategoryInfo.categoryDesc': [
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
                    'editMainCategoryInfo.mainCategoryId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "目录编号不能为空"
                        }],
                    'editMainCategoryInfo.seq': [
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
            editMainCategory: function () {
                if (!vc.component.editMainCategoryValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/productCategory/updateMainCategory',
                    JSON.stringify(vc.component.editMainCategoryInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMainCategoryModel').modal('hide');
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
            refreshEditMainCategoryInfo: function () {
                vc.component.editMainCategoryInfo = {
                    mainCategoryId: '',
                    categoryName: '',
                    categoryType: '',
                    startTime: '',
                    endTime: '',
                    categoryDesc: '',
                    seq: ''
                }
            }
        }
    });

})(window.vc, window.vc.component);
