(function (vc, vm) {

    vc.extends({
        data: {
            editMarketGoodsInfo: {
                goodsId: '',
                name: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editMarketGoods', 'openEditMarketGoodsModal', function (_params) {
                vc.component.refreshEditMarketGoodsInfo();
                $('#editMarketGoodsModel').modal('show');
                vc.copyObject(_params, vc.component.editMarketGoodsInfo);
            });
        },
        methods: {
            editMarketGoodsValidate: function () {
                return vc.validate.validate({
                    editMarketGoodsInfo: vc.component.editMarketGoodsInfo
                }, {
                    'editMarketGoodsInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        },
                    ],
                    'editMarketGoodsInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注'不能超过512"
                        },
                    ],
                    'editMarketGoodsInfo.goodsId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editMarketGoods: function () {
                if (!vc.component.editMarketGoodsValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketGoods.updateMarketGoods',
                    JSON.stringify(vc.component.editMarketGoodsInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMarketGoodsModel').modal('hide');
                            vc.emit('marketGoodsManage', 'listMarketGoods', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditMarketGoodsInfo: function () {
                vc.component.editMarketGoodsInfo = {
                    goodsId: '',
                    name: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
