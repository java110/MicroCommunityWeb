(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addSupplierInfo: {
                supplierId: '',
                stId: '',
                supplierName: '',
                beanName: '',
                personName: '',
                personTel: '',
                startTime: '',
                endTime: '',
                remark: '',
                beanNames:[],
                supplierTypes:[]

            }
        },
        _initMethod: function () {
            vc.getDict('supplier','bean_name',function(_data){
                $that.addSupplierInfo.beanNames = _data;
            })
            $that._listAddSupplierTypes();

            vc.initDateTime('addStartTime',function(_value){
                $that.addSupplierInfo.startTime = _value;
            });
            vc.initDateTime('addEndTime',function(_value){
                $that.addSupplierInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('addSupplier', 'openAddSupplierModal', function () {
                $('#addSupplierModel').modal('show');
            });
        },
        methods: {
            addSupplierValidate() {
                return vc.validate.validate({
                    addSupplierInfo: vc.component.addSupplierInfo
                }, {
                    'addSupplierInfo.stId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "供应商类型不能超过30"
                        },
                    ],
                    'addSupplierInfo.supplierName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "255",
                            errInfo: "供应商名称不能超过255"
                        },
                    ],
                    'addSupplierInfo.beanName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "适配器名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "60",
                            errInfo: "适配器名称不能超过60"
                        },
                    ],
                    'addSupplierInfo.personName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "联系人不能超过64"
                        },
                    ],
                    'addSupplierInfo.personTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "联系电话不能超过11"
                        },
                    ],
                    'addSupplierInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "开始时间不能超过30"
                        },
                    ],
                    'addSupplierInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "结束时间不能超过30"
                        },
                    ],
                    'addSupplierInfo.remark': [
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
                });
            },
            saveSupplierInfo: function () {
                if (!vc.component.addSupplierValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.http.apiPost(
                    '/supplier.saveSupplier',
                    JSON.stringify(vc.component.addSupplierInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addSupplierModel').modal('hide');
                            vc.component.clearAddSupplierInfo();
                            vc.emit('supplierManage', 'listSupplier', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddSupplierInfo: function () {
                let _beanNames = $that.addSupplierInfo.beanNames;
                let _supplierTypes = $that.addSupplierInfo.supplierTypes;
                vc.component.addSupplierInfo = {
                    stId: '',
                    supplierName: '',
                    beanName: '',
                    personName: '',
                    personTel: '',
                    startTime: '',
                    endTime: '',
                    remark: '',
                    beanNames:_beanNames,
                    supplierTypes:_supplierTypes
                };
            },
            _listAddSupplierTypes: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100
                    }
                };
                //发送get请求
                vc.http.apiGet('/supplierType.listSupplierType',
                    param,
                    function (json, res) {
                        let _supplierTypeManageInfo = JSON.parse(json);
                        $that.addSupplierInfo.supplierTypes = _supplierTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
