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
                    invoiceType: '',
                    ownerName: '',
                    applyTel: '',
                    createUserName: '',
                    state: '',
                }
            }
        },
        _initMethod: function () {
            $that._listInvoiceApplys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

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
            }


        }
    });
})(window.vc);
