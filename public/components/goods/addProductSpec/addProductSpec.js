(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addProductSpecInfo: {
                specId: '',
                specName: '',
                specDetails:[]
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addProductSpec', 'openAddProductSpecModal', function () {
                $that.clearAddProductSpecInfo();
                $that._addSpecDetail();
                $('#addProductSpecModel').modal('show');
            });
        },
        methods: {
            addProductSpecValidate() {
                return vc.validate.validate({
                    addProductSpecInfo: vc.component.addProductSpecInfo
                }, {
                    'addProductSpecInfo.specName': [
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




                });
            },
            saveProductSpecInfo: function () {
                if (!vc.component.addProductSpecValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addProductSpecInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addProductSpecInfo);
                    $('#addProductSpecModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/product/saveProductSpec',
                    JSON.stringify(vc.component.addProductSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addProductSpecModel').modal('hide');
                            vc.component.clearAddProductSpecInfo();
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
            clearAddProductSpecInfo: function () {
                vc.component.addProductSpecInfo = {
                    specId: '',
                    specName: '',
                    specDetails:[]
                };
            },
            _addSpecDetail:function(){
                let _specDetails = $that.addProductSpecInfo.specDetails;
                let _spec = {
                    id:vc.uuid(),
                    detailName:'',
                    detailValue:''
                };

                _specDetails.push(_spec);

                $that.addProductSpecInfo.specDetails = _specDetails;
            },
            _deleteSpecDetail:function(item){
                let _specDetails = $that.addProductSpecInfo.specDetails;
                let index = _specDetails.indexOf(item); 
                if (index > -1) { 
                     _specDetails.splice(index, 1); 
                }
            }
        }
    });

})(window.vc);
