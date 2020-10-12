(function (vc, vm) {

    vc.extends({
        data: {
            editProductSpecInfo: {
                specId: '',
                specName: '',
                specDetails:[]
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editProductSpec', 'openEditProductSpecModal', function (_params) {
                vc.component.refreshEditProductSpecInfo();
                $('#editProductSpecModel').modal('show');
                vc.copyObject(_params, vc.component.editProductSpecInfo);
                if(!_params.hasOwnProperty('productSpecDetails')){
                    return ;
                }
                let _productSpecDetails = _params.productSpecDetails;
                _productSpecDetails.forEach(item => {
                    item.id = vc.uuid;
                });

                $that.editProductSpecInfo.specDetails = _productSpecDetails;
            });
        },
        methods: {
            editProductSpecValidate: function () {
                return vc.validate.validate({
                    editProductSpecInfo: vc.component.editProductSpecInfo
                }, {
                    'editProductSpecInfo.specName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "规格名称不能超过100位"
                        },
                    ],
                    'editProductSpecInfo.specId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格ID不能为空"
                        }]

                });
            },
            editProductSpec: function () {
                if (!vc.component.editProductSpecValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/product/updateProductSpec',
                    JSON.stringify(vc.component.editProductSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editProductSpecModel').modal('hide');
                            vc.emit('productSpecManage', 'listProductSpec', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditProductSpecInfo: function () {
                vc.component.editProductSpecInfo = {
                    specId: '',
                    specName: '',
                    specDetails:[]
                }
            },
            _addEditSpecDetail:function(){
                let _specDetails = $that.editProductSpecInfo.specDetails;
                let _spec = {
                    id:vc.uuid(),
                    detailName:'',
                    detailValue:'',
                    detailId:'-1'
                };

                _specDetails.push(_spec);

                $that.editProductSpecInfo.specDetails = _specDetails;
            },
            _deleteEditSpecDetail:function(item){
                let _specDetails = $that.editProductSpecInfo.specDetails;
                let index = _specDetails.indexOf(item); 
                if (index > -1) { 
                     _specDetails.splice(index, 1); 
                }
            }
        }
    });

})(window.vc, window.vc.component);
