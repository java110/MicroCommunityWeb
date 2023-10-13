/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            invoiceApplyInfo: {
                invoiceApplys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                applyId: '',
                states:[{
                    stateName:'全部',
                    state:'',
                },{
                    stateName:'待审核',
                    state:'W',
                },{
                    stateName:'待上传',
                    state:'U',
                },{
                    stateName:'审核失败',
                    state:'F',
                },{
                    stateName:'带领用',
                    state:'G',
                },{
                    stateName:'已领用',
                    state:'C',
                }],
                conditions: {
                    applyId: '',
                    invoiceCode:'',
                    invoiceType: '',
                    ownerName: '',
                    applyTel: '',
                    createUserName: '',
                    state: '',
                },
                audit:{}
            }
        },
        _initMethod: function () {
            $that._listInvoiceApplys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('invoiceApply', 'notifyAuditInfo', function (_auditInfo) {
                $that._auditInvoiceState(_auditInfo);
            });
            vc.on('invoiceApply', 'listInvoiceApply', function (_param) {
                $that._listInvoiceApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listInvoiceApplys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listInvoiceApplys: function (_page, _rows) {
                $that.invoiceApplyInfo.conditions.page = _page;
                $that.invoiceApplyInfo.conditions.row = _rows;
                $that.invoiceApplyInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.invoiceApplyInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/invoice.listInvoiceApply',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.invoiceApplyInfo.total = _json.total;
                        $that.invoiceApplyInfo.records = _json.records;
                        $that.invoiceApplyInfo.invoiceApplys = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.invoiceApplyInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openDeleteInvoiceApplyModel: function (_invoiceApply) {
                vc.emit('deleteInvoiceApply', 'openDeleteInvoiceApplyModal', _invoiceApply);
            },
            _queryInvoiceApplyMethod: function () {
                $that._listInvoiceApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.invoiceApplyInfo.moreCondition) {
                    $that.invoiceApplyInfo.moreCondition = false;
                } else {
                    $that.invoiceApplyInfo.moreCondition = true;
                }
            },
            swatchState:function(_state){
                $that.invoiceApplyInfo.conditions.state = _state.state;
                $that._listInvoiceApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _invoiceApply:function(){
                vc.jumpToPage('/#/pages/fee/ownerApplyInvoice')
            },
            _openInvoiceApplyDetail:function(_invoiceApply){
                vc.jumpToPage('/#/pages/fee/invoiceApplyDetail?applyId='+_invoiceApply.applyId);
            },
            _openInvoiceAuditModel(_invoiceApply) {
                $that.invoiceApplyInfo.audit = _invoiceApply;
                vc.emit('audit', 'openAuditModal', {});
            },
            _auditInvoiceState: function (_auditInfo) {
                $that.invoiceApplyInfo.audit.state = _auditInfo.state;
                $that.invoiceApplyInfo.audit.remark = _auditInfo.remark;
                vc.http.apiPost(
                    '/invoice.auditInvoiceApply',
                    JSON.stringify( $that.invoiceApplyInfo.audit), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $that._listInvoiceApplys(DEFAULT_PAGE, DEFAULT_ROWS);
                            vc.toast("审核成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            _openUploadInvoicePhoto:function(_apply){
                vc.emit('uploadInvoicePhoto', 'openInvoicePhotoModal',_apply);
            },
            _openUserGetInvoice:function(_apply){
                vc.emit('wirteInvoiceEvent', 'openWirteInvoiceModal',_apply);
            }


        }
    });
})(window.vc);
