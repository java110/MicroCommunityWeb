(function (vc, vm) {

    vc.extends({
        data: {
            editSupplierInfo: {
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
                $that.editSupplierInfo.beanNames = _data;
            })
            $that._listEditSupplierTypes();

            vc.initDateTime('editStartTime',function(_value){
                $that.editSupplierInfo.startTime = _value;
            });
            vc.initDateTime('editEndTime',function(_value){
                $that.editSupplierInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('editSupplier', 'openEditSupplierModal', function (_params) {
                vc.component.refreshEditSupplierInfo();
                $('#editSupplierModel').modal('show');
                vc.copyObject(_params, vc.component.editSupplierInfo);
            });
        },
        methods: {
            editSupplierValidate: function () {
                return vc.validate.validate({
                    editSupplierInfo: vc.component.editSupplierInfo
                }, {
                    'editSupplierInfo.stId': [
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
                    'editSupplierInfo.supplierName': [
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
                    'editSupplierInfo.beanName': [
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
                    'editSupplierInfo.personName': [
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
                    'editSupplierInfo.personTel': [
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
                    'editSupplierInfo.startTime': [
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
                    'editSupplierInfo.endTime': [
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
                    'editSupplierInfo.remark': [
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
                    'editSupplierInfo.supplierId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editSupplier: function () {
                if (!vc.component.editSupplierValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/supplier.updateSupplier',
                    JSON.stringify(vc.component.editSupplierInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editSupplierModel').modal('hide');
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
            refreshEditSupplierInfo: function () {
                let _beanNames = $that.editSupplierInfo.beanNames;
                let _supplierTypes = $that.editSupplierInfo.supplierTypes;
                vc.component.editSupplierInfo = {
                    supplierId: '',
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
                }
            },
            _listEditSupplierTypes: function (_page, _rows) {
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
                        $that.editSupplierInfo.supplierTypes = _supplierTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);
