(function (vc, vm) {
    vc.extends({
        data: {
            visitOwnerRepairInfo: {
                repairId: '',
                visitType: '',
                context: ''
            }
        },
        _initMethod: function () {
            vc.component._initEditOwnerRepairInfo();
        },
        _initEvent: function () {
           
            vc.on('visitOwnerRepair', 'openVisitOwnerRepairModal', function (_params) {
                vc.component.refreshVisitOwnerRepairInfo();
                vc.copyObject(_params, vc.component.visitOwnerRepairInfo);
                $('#visitOwnerRepairModel').modal('show');
                vc.component.visitOwnerRepairInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            visitOwnerRepairValidate: function () {
                return vc.validate.validate({
                    visitOwnerRepairInfo: vc.component.visitOwnerRepairInfo
                }, {
                    'visitOwnerRepairInfo.visitType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修类型不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "报修类型错误"
                        },
                    ],
                    'visitOwnerRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1000",
                            errInfo: "报修内容不能超过1000个字"
                        },
                    ],
                    'visitOwnerRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修ID不能为空"
                        }]
                });
            },
            _visitOwnerRepair: function () {
            
                if (!vc.component.visitOwnerRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.visitOwnerRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/repair/saveRepairReturnVisit',
                    JSON.stringify(vc.component.visitOwnerRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#visitOwnerRepairModel').modal('hide');
                            vc.emit('repairReturnVisit', 'listRepairPool', {});
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshVisitOwnerRepairInfo: function () {
                vc.component.visitOwnerRepairInfo = {
                    repairId: '',
                    visitType: '',
                    context: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
