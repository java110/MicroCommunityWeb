/**
 入驻小区
 **/
(function (vc) {
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
                    paymentCd: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            //关联字典表费用类型
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.feeConfigManageInfo.feeTypeCds = _data;
            });
            //关联字典表费用标识
            vc.getDict('pay_fee_config', 'fee_flag', function (_data) {
                vc.component.feeConfigManageInfo.feeFlags = _data;
            });
            //关联字典表付费类型
            vc.getDict('pay_fee_config', 'payment_cd', function (_data) {
                vc.component.feeConfigManageInfo.paymentCds = _data;
            });
            //关联字典表出账类型
            vc.getDict('pay_fee_config', 'bill_type', function (_data) {
                vc.component.feeConfigManageInfo.billTypes = _data;
            });
            //关联字典表费用项
            vc.getDict('pay_fee_config', 'is_default', function (_data) {
                vc.component.feeConfigManageInfo.isDefaults = _data;
            })
        },
        _initEvent: function () {
            vc.on('feeConfigManage', 'listFeeConfig',
                function (_param) {
                    vc.component._listFeeConfigs($that.feeConfigManageInfo.curPage, DEFAULT_ROWS);
                });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    $that.feeConfigManageInfo.curPage = _currentPage;
                    vc.component._listFeeConfigs(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            //查询方法
            _listFeeConfigs: function (_page, _rows) {
                vc.component.feeConfigManageInfo.conditions.page = _page;
                vc.component.feeConfigManageInfo.conditions.row = _rows;
                vc.component.feeConfigManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.feeConfigManageInfo.conditions
                };
                //收费项目选框去空
                param.params.feeName = param.params.feeName.trim();
                //费用项ID选框去空
                param.params.configId = param.params.configId.trim();
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.feeConfigManageInfo.total = _feeConfigManageInfo.total;
                        vc.component.feeConfigManageInfo.records = _feeConfigManageInfo.records;
                        vc.component.feeConfigManageInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeConfigManageInfo.records,
                            dataCount: vc.component.feeConfigManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetListFeeConfigs: function () {
                vc.component.feeConfigManageInfo.conditions.configId = '';
                vc.component.feeConfigManageInfo.conditions.feeName = '';
                vc.component.feeConfigManageInfo.conditions.feeTypeCd = '';
                vc.component.feeConfigManageInfo.conditions.feeFlag = '';
                vc.component.feeConfigManageInfo.conditions.paymentCd = '';
                vc.component.feeConfigManageInfo.conditions.billType = '';
                vc.component.feeConfigManageInfo.conditions.isDefault = '';
                $that._listFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddFeeConfigModal: function () {
                vc.emit('addFeeConfig', 'openAddFeeConfigModal', {});
            },
            _openEditFeeConfigModel: function (_feeConfig) {
                vc.emit('editFeeConfig', 'openEditFeeConfigModal', _feeConfig);
            },
            _openDeleteFeeConfigModel: function (_feeConfig) {
                vc.emit('deleteFeeConfig', 'openDeleteFeeConfigModal', _feeConfig);
            },
            //查询
            _queryFeeConfigMethod: function () {
                vc.component._listFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetFeeConfigMethod: function () {
                vc.component._resetListFeeConfigs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.feeConfigManageInfo.moreCondition) {
                    vc.component.feeConfigManageInfo.moreCondition = false;
                } else {
                    vc.component.feeConfigManageInfo.moreCondition = true;
                }
            },
            _settingConfigDiscount: function (_feeConfig) {
                vc.jumpToPage('/#/pages/property/payFeeConfigDiscountManage?configId=' + _feeConfig.configId + "&feeName=" + _feeConfig.feeName);
            }
        }
    });
})(window.vc);