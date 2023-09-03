(function (vc, vm) {
    vc.extends({
        data: {
            ownerCommitteeDetailInfo: {
                ocId: '',
                name: '',
                sex: '',
                link: '',
                idCard: '',
                address: '',
                position: '',
                post: '',
                postDesc: '',
                appointTime: '',
                curTime: '',
                state: '',
                remark: '',
                contracts: [],
                communityId: '',
            }
        },
        _initMethod: function () {
            $that.ownerCommitteeDetailInfo.ocId = vc.getParam('ocId');
            $that._listOwnerCommittees();
            $that._listOwnerCommitteeContracts();
        },
        _initEvent: function () {
        },
        methods: {
            _listOwnerCommittees: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        ocId: $that.ownerCommitteeDetailInfo.ocId
                    }
                };
                //发送get请求
                vc.http.apiGet('/ownerCommittee.listOwnerCommittee',
                    param,
                    function (json, res) {
                        let _ownerCommitteeManageInfo = JSON.parse(json);
                        vc.copyObject(_ownerCommitteeManageInfo.data[0], $that.ownerCommitteeDetailInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOwnerCommitteeContracts: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        ocId: $that.ownerCommitteeDetailInfo.ocId
                    }
                };
                //发送get请求
                vc.http.apiGet('/ownerCommittee.listOwnerCommitteeContract',
                    param,
                    function (json, res) {
                        let _ownerCommitteeManageInfo = JSON.parse(json);
                        $that.ownerCommitteeDetailInfo.contracts = _ownerCommitteeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc, window.vc.component);