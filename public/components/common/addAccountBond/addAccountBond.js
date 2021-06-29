(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAccountBondInfo: {
                bondId: '',
                bondName: '',
                amount: '',
                bondMonth: '',
                objId: '',
                bondType: '6006',
                remark: '',
                shopTypes : []

            }
        },
        _initMethod: function () {
            $that._listAddShopTypes();
        },
        _initEvent: function () {
            vc.on('addAccountBond', 'openAddAccountBondModal', function () {
                $('#addAccountBondModel').modal('show');
            });
        },
        methods: {
            addAccountBondValidate() {
                return vc.validate.validate({
                    addAccountBondInfo: vc.component.addAccountBondInfo
                }, {
                    'addAccountBondInfo.bondName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "保证金名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,20",
                            errInfo: "保证金名称超长了"
                        },
                    ],
                    'addAccountBondInfo.amount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "保证金金额不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,10",
                            errInfo: "保证金金额格式有误"
                        },
                    ],
                    'addAccountBondInfo.bondMonth': [
                        {
                            limit: "num",
                            param: "",
                            errInfo: "有效月份格式错误"
                        },
                    ],
                    'addAccountBondInfo.objId': [
                        {
                            limit: "maxin",
                            param: "1,30",
                            errInfo: "类型ID超长了"
                        },
                    ],




                });
            },
            saveAccountBondInfo: function () {
                if (!vc.component.addAccountBondValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addAccountBondInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addAccountBondInfo);
                    $('#addAccountBondModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/accountBond/saveAccountBond',
                    JSON.stringify(vc.component.addAccountBondInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAccountBondModel').modal('hide');
                            vc.component.clearAddAccountBondInfo();
                            vc.emit('accountBondManage', 'listAccountBond', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            _listAddShopTypes:function(){

               var param = {
                params: {
                    page: 1,
                    row: 100
                }
            };
               //发送get请求
               vc.http.apiGet('/shopType/queryShopType',
                             param,
                             function(json,res){
                                var _shopTypeManageInfo=JSON.parse(json);
                                vc.component.addAccountBondInfo.total = _shopTypeManageInfo.total;
                                vc.component.addAccountBondInfo.records = _shopTypeManageInfo.records;
                                vc.component.addAccountBondInfo.shopTypes = _shopTypeManageInfo.data;
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            setAddBondName:function(_objId){

                $that.addAccountBondInfo.shopTypes.forEach(item => {
                    if (item.shopTypeId == _objId) {
                        $that.addAccountBondInfo.bondName = item.typeName;
                    }
                });
            },
            clearAddAccountBondInfo: function () {
                vc.component.addAccountBondInfo = {
                    bondName: '',
                    amount: '',
                    bondMonth: '',
                    objId: '',
                    bondType: '6006',
                    remark: '',
                    shopTypes : []

                };
            }
        }
    });

})(window.vc);
