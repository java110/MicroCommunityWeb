(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFeePrintPageInfo: {
                pageId: '',
                pageName: '',
                communityId: vc.getCurrentCommunity().communityId,
                pageUrl: '',
                templates: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addFeePrintPage', 'openAddFeePrintPageModal', function () {
                $that._listAddTemplates();
                $('#addFeePrintPageModel').modal('show');
            });
        },
        methods: {
            addFeePrintPageValidate() {
                return vc.validate.validate({
                    addFeePrintPageInfo: vc.component.addFeePrintPageInfo
                }, {
                    'addFeePrintPageInfo.pageName': [
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
                    'addFeePrintPageInfo.communityId': [
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
                    'addFeePrintPageInfo.pageUrl': [
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
                });
            },
            saveFeePrintPageInfo: function () {
                if (!vc.component.addFeePrintPageValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFeePrintPageInfo);
                    $('#addFeePrintPageModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'feePrintPage.saveFeePrintPage',
                    JSON.stringify(vc.component.addFeePrintPageInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeePrintPageModel').modal('hide');
                            vc.component.clearAddFeePrintPageInfo();
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
            clearAddFeePrintPageInfo: function () {
                vc.component.addFeePrintPageInfo = {
                    pageName: '',
                    communityId: '',
                    pageUrl: '',
                    templates: []
                };
            },
            _listAddTemplates: function (_page, _rows) {
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
                        $that.addFeePrintPageInfo.templates = _feePrintPageManageInfo.data;
                      
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
