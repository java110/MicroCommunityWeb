/**
 业主详情页面
 **/
(function (vc) {
    vc.extends({
        data: {
            contractDetailInfo: {
                contractId: '',
                contractName: '',
                contractCode: '',
                contractType: '',
                contractTypeName: '',
                partyA: '',
                partyB: '',
                aContacts: '',
                bContacts: '',
                aLink: '',
                bLink: '',
                operator: '',
                operatorLink: '',
                amount: '',
                startTime: '',
                endTime: '',
                signingTime: '',
                param: '',
                planType: '',
                stateName: '',
                contractParentId: '',
                contractParentName: '',
                contractParentCode: '',
                objId: '',
                files: [],
                _currentTab: 'contractDetailRoom',
            }
        },
        _initMethod: function () {
            $that.contractDetailInfo.contractId = vc.getParam('contractId');
            if (!vc.notNull($that.contractDetailInfo.contractId)) {
                return;
            }
            let _currentTab = vc.getParam('currentTab');
            if (_currentTab) {
                $that.contractDetailInfo._currentTab = _currentTab;
            }
            vc.component._loadContractInfo();
            $that.changeTab($that.contractDetailInfo._currentTab);
        },
        _initEvent: function () {
            vc.on('contractDetail', 'listContractData', function (_info) {
                vc.component._loadContractInfo();
                $that.changeTab($that.contractDetailInfo._currentTab);
            });
        },
        methods: {
            _loadContractInfo: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        contractId: $that.contractDetailInfo.contractId
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json) {
                        let _contractApplyDetailInfo = JSON.parse(json);
                        let _contractApply = _contractApplyDetailInfo.data[0];
                        vc.copyObject(_contractApply, $that.contractDetailInfo);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function (_tab) {
                $that.contractDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    contractId: $that.contractDetailInfo.contractId,
                    contractName: $that.contractDetailInfo.name,
                    link: $that.contractDetailInfo.link,
                    ownerId: $that.contractDetailInfo.objId
                })
            },
            _printContract: function () {
                let _contract = $that.contractDetailInfo;
                window.open("/print.html#/pages/admin/printContract?contractTypeId=" + _contract.contractType + "&contractId=" + _contract.contractId);
            }
        }
    });
})(window.vc);