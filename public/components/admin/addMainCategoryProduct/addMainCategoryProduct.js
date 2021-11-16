(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMainCategoryProductInfo: {
                mcProductId: '',
                mainCategoryId: '',
                productId: '',
                startTime: '',
                endTime: '',
                seq: '',
                mainCategoryProducts: []
            }
        },
        _initMethod: function () {
            vc.initDateTime('addStartTime', function (_value) {
                $that.addMainCategoryProductInfo.startTime = _value;
            });

            vc.initDateTime('addEndTime', function (_value) {
                $that.addMainCategoryProductInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('addMainCategoryProduct', 'openAddMainCategoryProductModal', function () {
                $that._listAddMainCategorys();
                $('#addMainCategoryProductModel').modal('show');
            });
        },
        methods: {
            addMainCategoryProductValidate() {
                return vc.validate.validate({
                    addMainCategoryProductInfo: vc.component.addMainCategoryProductInfo
                }, {
                    'addMainCategoryProductInfo.mainCategoryId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "目录不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "目录格式错误"
                        },
                    ],
                    'addMainCategoryProductInfo.productId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "商品编号太长"
                        },
                    ],
                    'addMainCategoryProductInfo.startTime': [
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
                    'addMainCategoryProductInfo.endTime': [
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
                    'addMainCategoryProductInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序必须是整数"
                        },
                    ],
                });
            },
            saveMainCategoryProductInfo: function () {
                if (!vc.component.addMainCategoryProductValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addMainCategoryProductInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMainCategoryProductInfo);
                    $('#addMainCategoryProductModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/productCategory/saveMainCategoryProduct',
                    JSON.stringify(vc.component.addMainCategoryProductInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMainCategoryProductModel').modal('hide');
                            vc.component.clearAddMainCategoryProductInfo();
                            vc.emit('mainCategoryProductManage', 'listMainCategoryProduct', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMainCategoryProductInfo: function () {
                vc.component.addMainCategoryProductInfo = {
                    mainCategoryId: '',
                    productId: '',
                    productName: '',
                    startTime: '',
                    endTime: '',
                    seq: '',
                    mainCategoryProducts: []
                };
            },
            _listAddMainCategorys: function (_page, _rows) {

                var param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                };

                //发送get请求
                vc.http.apiGet('/productCategory/queryMainCategory',
                    param,
                    function (json, res) {
                        var _mainCategoryProductManageInfo = JSON.parse(json);
                        vc.component.addMainCategoryProductInfo.mainCategoryProducts = _mainCategoryProductManageInfo.data;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
