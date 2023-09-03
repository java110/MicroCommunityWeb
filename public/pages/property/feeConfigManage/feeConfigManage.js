/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeConfigManageInfo: {
                feeConfigs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                feeName: '',
                feeTypeCds: [],
                feeFlags: [],
                paymentCds: [],
                billTypes: [],
                isDefaults: [],
                curPage: DEFAULT_PAGE,
                conditions: {
                    configId: '',
                    feeFlag: '',
                    billType: '',
                    feeName: '',
                    feeTypeCd: '',
                    isDefault: 'F',
                    paymentCd: '',
                    deductFrom: ''
                }
            }
        },
        _initMethod: function() {
            $that._listFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            //关联字典表费用类型
            vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                $that.feeConfigManageInfo.feeTypeCds = [{
                    statusCd: '',
                    name: '全部'
                }];
                _data.forEach(item => {
                    $that.feeConfigManageInfo.feeTypeCds.push(item);
                });
            });
            //关联字典表费用标识
            vc.getDict('pay_fee_config', 'fee_flag', function(_data) {
                $that.feeConfigManageInfo.feeFlags = _data;
            });
            //关联字典表付费类型
            vc.getDict('pay_fee_config', 'payment_cd', function(_data) {
                $that.feeConfigManageInfo.paymentCds = _data;
            });
            //关联字典表出账类型
            vc.getDict('pay_fee_config', 'bill_type', function(_data) {
                $that.feeConfigManageInfo.billTypes = _data;
            });
            //关联字典表费用项
            vc.getDict('pay_fee_config', 'is_default', function(_data) {
                $that.feeConfigManageInfo.isDefaults = _data;
            })
        },
        _initEvent: function() {
            vc.on('feeConfigManage', 'listFeeConfig',
                function(_param) {
                    $that._listFeeConfigs($that.feeConfigManageInfo.curPage, DEFAULT_ROWS);
                });
            vc.on('pagination', 'page_event',
                function(_currentPage) {
                    $that.feeConfigManageInfo.curPage = _currentPage;
                    $that._listFeeConfigs(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            //查询方法
            _listFeeConfigs: function(_page, _rows) {
                $that.feeConfigManageInfo.conditions.page = _page;
                $that.feeConfigManageInfo.conditions.row = _rows;
                $that.feeConfigManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.feeConfigManageInfo.conditions
                };
                //收费项目选框去空
                param.params.feeName = param.params.feeName.trim();
                //费用项ID选框去空
                param.params.configId = param.params.configId.trim();
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function(json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.feeConfigManageInfo.total = _feeConfigManageInfo.total;
                        $that.feeConfigManageInfo.records = _feeConfigManageInfo.records;
                        $that.feeConfigManageInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                        vc.emit('pagination', 'init', {
                            total: $that.feeConfigManageInfo.records,
                            dataCount: $that.feeConfigManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetListFeeConfigs: function() {
                $that.feeConfigManageInfo.conditions.configId = '';
                $that.feeConfigManageInfo.conditions.feeName = '';
                $that.feeConfigManageInfo.conditions.feeTypeCd = '';
                $that.feeConfigManageInfo.conditions.feeFlag = '';
                $that.feeConfigManageInfo.conditions.paymentCd = '';
                $that.feeConfigManageInfo.conditions.billType = '';
                $that.feeConfigManageInfo.conditions.isDefault = '';
                $that.feeConfigManageInfo.conditions.deductFrom = '';
                $that._listFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddFeeConfigModal: function() {
                vc.emit('addFeeConfig', 'openAddFeeConfigModal', {});
            },
            _openEditFeeConfigModel: function(_feeConfig) {
                vc.emit('editFeeConfig', 'openEditFeeConfigModal', _feeConfig);
            },
            _openDeleteFeeConfigModel: function(_feeConfig) {
                vc.emit('deleteFeeConfig', 'openDeleteFeeConfigModal', _feeConfig);
            },
            //查询
            _queryFeeConfigMethod: function() {
                $that._listFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetFeeConfigMethod: function() {
                $that._resetListFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if ($that.feeConfigManageInfo.moreCondition) {
                    $that.feeConfigManageInfo.moreCondition = false;
                } else {
                    $that.feeConfigManageInfo.moreCondition = true;
                }
            },
            _settingConfigDiscount: function(_feeConfig) {
                vc.jumpToPage('/#/pages/property/payFeeConfigDiscountManage?configId=' + _feeConfig.configId + "&feeName=" + _feeConfig.feeName);
            },
            swatchFeeTypeCd: function(item) {
                $that.feeConfigManageInfo.conditions.feeTypeCd = item.statusCd;
                $that._listFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openFeeConfigDetail: function(_feeConfig) {
                window.open('/#/pages/fee/feeConfigDetail?configId=' + _feeConfig.configId)
            }
        }
    });
})(window.vc);