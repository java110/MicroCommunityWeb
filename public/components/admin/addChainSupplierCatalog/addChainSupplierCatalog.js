(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addChainSupplierCatalogInfo: {
                catalogId: '',
                catalogName: '',
                csId: '',
                intfUrlParam: '',
                seq: '',
                seq: '',
                statusCd:'0'

            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
           
            vc.on('addChainSupplierCatalog', 'openAddChainSupplierCatalogModal', function (_params) {
                $('#addChainSupplierCatalogModel').modal('show');
                vc.component.addChainSupplierCatalogInfo.csId = _params.csId;
            });

           
        },
        methods: {
            addChainSupplierCatalogValidate() {
                return vc.validate.validate({
                    addChainSupplierCatalogInfo: vc.component.addChainSupplierCatalogInfo
                }, {
                    'addChainSupplierCatalogInfo.catalogName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "分类名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "供应商分类名称不能超过32"
                        },
                    ],
                    'addChainSupplierCatalogInfo.csId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "32",
                            errInfo: "供应商ID不能为空"
                        },
                    ],
                    'addChainSupplierCatalogInfo.intfUrlParam': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "对端接口参数不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "对端接口参数不能为空"
                        },
                    ],
                    'addChainSupplierCatalogInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "排序不能为空"
                        },
                    ],




                });
            },
            saveChainSupplierCatalogInfo: function () {
                if (!vc.component.addChainSupplierCatalogValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addChainSupplierCatalogInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addChainSupplierCatalogInfo);
                    $('#addChainSupplierCatalogModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'chainSupplierCatalog.saveChainSupplierCatalog',
                    JSON.stringify(vc.component.addChainSupplierCatalogInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addChainSupplierCatalogModel').modal('hide');
                            vc.component.clearAddChainSupplierCatalogInfo();
                            vc.emit('chainSupplierCatalogManage', 'listChainSupplierCatalog', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddChainSupplierCatalogInfo: function () {
                vc.component.addChainSupplierCatalogInfo = {
                    catalogName: '',
                    csId: '',
                    intfUrlParam: '',
                    seq: '',

                };
            }
        }
    });

})(window.vc);
