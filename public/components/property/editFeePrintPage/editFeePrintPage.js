(function (vc, vm) {

    vc.extends({
        data: {
            editFeePrintPageInfo: {
                pageId: '',
                pageName: '',
                communityId: '',
                pageUrl: '',
                templates: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editFeePrintPage', 'openEditFeePrintPageModal', function (_params) {
                vc.component.refreshEditFeePrintPageInfo();
                $that._listEditTemplates();
                $('#editFeePrintPageModel').modal('show');
                vc.copyObject(_params, vc.component.editFeePrintPageInfo);
                vc.component.editFeePrintPageInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editFeePrintPageValidate: function () {
                return vc.validate.validate({
                    editFeePrintPageInfo: vc.component.editFeePrintPageInfo
                }, {
                    'editFeePrintPageInfo.pageName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "名称不能超过128"
                        },
                    ],
                    'editFeePrintPageInfo.communityId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小区ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "小区ID不能超过30"
                        },
                    ],
                    'editFeePrintPageInfo.pageUrl': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "收据页面不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "收据页面不能超过512"
                        },
                    ],
                    'editFeePrintPageInfo.pageId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "收据ID不能为空"
                        }]

                });
            },
            editFeePrintPage: function () {
                if (!vc.component.editFeePrintPageValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'feePrintPage.updateFeePrintPage',
                    JSON.stringify(vc.component.editFeePrintPageInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeePrintPageModel').modal('hide');
                            vc.emit('feePrintPageManage', 'listFeePrintPage', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditFeePrintPageInfo: function () {
                vc.component.editFeePrintPageInfo = {
                    pageId: '',
                    pageName: '',
                    communityId: '',
                    pageUrl: '',
                    templates: []
                }
            },
            _listEditTemplates: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50
                    }
                };

                //发送get请求
                vc.http.apiGet('feePrintPageTemplate.listFeePrintPageTemplate',
                    param,
                    function (json, res) {
                        var _feePrintPageManageInfo = JSON.parse(json);
                        $that.editFeePrintPageInfo.templates = _feePrintPageManageInfo.data;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);
