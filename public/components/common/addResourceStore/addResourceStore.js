(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addResourceStoreInfo: {
                goodsType: '',
                goodsTypes: [],
                unitCode: '',
                unitCodes: [],
                resId: '',
                resName: '',
                resCode: '',
                price: '',
                outLowPrice: '',
                outHighPrice: '',
                showMobile: '',
                description: '',
                remark: '',
                photos: []
            }
        },
        _initMethod: function () {
            //与字典表物品类型关联
            vc.getDict('resource_store', "goods_type", function (_data) {
                vc.component.addResourceStoreInfo.goodsTypes = _data;
            });
            //与字典表单位关联
            vc.getDict('resource_store', "unit_code", function (_data) {
                vc.component.addResourceStoreInfo.unitCodes = _data;
            });
        },
        _initEvent: function () {
            vc.on('addResourceStore', 'openAddResourceStoreModal', function () {
                $('#addResourceStoreModel').modal('show');
            });
            vc.on("addResourceStore", "notifyUploadImage", function (_param) {
                vc.component.addResourceStoreInfo.photos = _param;
            });
        },
        methods: {
            addResourceStoreValidate() {
                return vc.validate.validate({
                    addResourceStoreInfo: vc.component.addResourceStoreInfo
                }, {
                    'addResourceStoreInfo.resName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,100",
                            errInfo: "物品名称长度为2至100"
                        },
                    ],
                    'addResourceStoreInfo.resCode': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "物品编码不能超过50位"
                        },
                    ],
                    'addResourceStoreInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品价格不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "物品价格格式错误"
                        },
                    ],
                    'addResourceStoreInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述不能为空"
                        },
                    ],
                    'addResourceStoreInfo.showMobile': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机端显示不能为空"
                        },
                    ],
                    'addResourceStoreInfo.outLowPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最低收费标准不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "收费标准格式错误"
                        },
                    ],
                    'addResourceStoreInfo.outHighPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "最高收费标准不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "收费标准格式错误"
                        },
                    ],
                    'addResourceStoreInfo.unitCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "单位不能为空"
                        },
                    ],
                    'addResourceStoreInfo.goodsType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品类型不能为空"
                        },
                    ],
                });
            },
            saveResourceStoreInfo: function () {
                if (!vc.component.addResourceStoreValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addResourceStoreInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addResourceStoreInfo);
                    $('#addResourceStoreModel').modal('hide');
                    return;
                }
                vc.http.post(
                    'addResourceStore',
                    'save',
                    JSON.stringify(vc.component.addResourceStoreInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addResourceStoreModel').modal('hide');
                            vc.component.clearAddResourceStoreInfo();
                            vc.emit('resourceStoreManage', 'listResourceStore', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddResourceStoreInfo: function () {
                vc.component.addResourceStoreInfo = {
                    resName: '',
                    resCode: '',
                    price: '',
                    description: '',
                    outLowPrice: '',
                    outHighPrice: '',
                    showMobile: '',
                    remark: '',
                    goodsType: '',
                    goodsTypes: [],
                    unitCode: '',
                    unitCodes: [],
                    photos: []
                };
            }
        }
    });
})(window.vc);
