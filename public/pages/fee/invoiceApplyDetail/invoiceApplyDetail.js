/**
业主详情页面
 **/
(function(vc) {
    var _fileUrl = '/callComponent/download/getFile/fileByObjId';
    vc.extends({
        data: {
            invoiceApplyDetailInfo: {
                applyId: '',
                invoiceType: '',
                ownerName: '',
                createUserName: '',
                invoiceName: '',
                invoiceNum: '',
                invoiceAddress: '',
                invoiceAmount: '',
                stateName: '',
                createTime:'',
                invoiceCode:'',
                urls:[],
                _currentTab: 'invoiceApplyDetailFee',
            }
        },
        _initMethod: function() {
            $that.invoiceApplyDetailInfo.applyId = vc.getParam('applyId');
            if (!vc.notNull($that.invoiceApplyDetailInfo.applyId)) {
                return;
            }
            $that._loadinvoiceApplyInfo();

        },
        _initEvent: function() {
            vc.on('invoiceApplyDetail', 'listCarData', function(_info) {
                //$that._loadinvoiceApplyInfo();
                $that.changeTab($that.invoiceApplyDetailInfo._currentTab);
            });
        },
        methods: {
            _loadinvoiceApplyInfo: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyId: $that.invoiceApplyDetailInfo.applyId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/invoice.listInvoiceApply',
                    param,
                    function(json) {
                        let _json = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        vc.copyObject(_json.data[0], $that.invoiceApplyDetailInfo);
                        $that.changeTab($that.invoiceApplyDetailInfo._currentTab);
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function(_tab) {
                $that.invoiceApplyDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    applyId: $that.invoiceApplyDetailInfo.applyId,
                })
            },
        }
    });
})(window.vc);