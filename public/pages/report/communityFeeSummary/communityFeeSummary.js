/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            communityFeeSummaryInfo: {
                fees: [],
                feeTypeCds: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    startDate: '',
                    endDate: '',
                    feeTypeCd: '',
                    communityId: ''
                }
            }
        },
        _initMethod: function() {
            $that._initDate();
            vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                $that.communityFeeSummaryInfo.feeTypeCds = _data
            });
           
        },
        _initEvent: function() {
            vc.on('selectAdminCommunity','changeCommunity',function(_community){
                $that.communityFeeSummaryInfo.conditions.communityId = _community.communityId;
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _initDate: function() {
                vc.initDate('startDate', function(_value) {
                    $that.communityFeeSummaryInfo.conditions.startDate = _value;
                });
                vc.initDate('endDate', function(_value) {
                    $that.communityFeeSummaryInfo.conditions.endDate = _value;
                });
                let _data = new Date();
                let _month = _data.getMonth() + 1;
                let _newDate = "";
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + "-01";
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + "-01";
                }
                $that.communityFeeSummaryInfo.conditions.startDate = _newDate;
                _data.setMonth(_data.getMonth() + 1);
                _data.setDate(0);
                _month = _data.getMonth() + 1;
                if (_month < 10) {
                    _newDate = _data.getFullYear() + "-0" + _month + '-' + _data.getDate();
                } else {
                    _newDate = _data.getFullYear() + "-" + _month + '-'+ _data.getDate();
                }
                $that.communityFeeSummaryInfo.conditions.endDate = _newDate;
            },
            //查询
            _queryMethod: function() {
                $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
           
            //查询方法
            _listFees: function(_page, _rows) {
                $that.communityFeeSummaryInfo.conditions.page = _page;
                $that.communityFeeSummaryInfo.conditions.row = _rows;
                //$that.communityFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.communityFeeSummaryInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/admin.getCommunityFeeSummary',
                    param,
                    function(json, res) {
                        let _communityFeeSummaryInfo = JSON.parse(json);

                        $that.communityFeeSummaryInfo.fees = _communityFeeSummaryInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _moreCondition: function() {
                if ($that.communityFeeSummaryInfo.moreCondition) {
                    $that.communityFeeSummaryInfo.moreCondition = false;
                } else {
                    $that.communityFeeSummaryInfo.moreCondition = true;
                }
            },
           
            _exportExcel: function() {
                $that.communityFeeSummaryInfo.conditions.pagePath = 'communityFeeSummary';
                let param = {
                    params: $that.communityFeeSummaryInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });
})(window.vc);