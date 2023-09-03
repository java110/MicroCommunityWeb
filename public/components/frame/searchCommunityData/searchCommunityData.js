(function (vc) {

    vc.extends({
        data: {
            searchCommunityDataInfo: {
                searchValue: '',
                rooms: [],
                owners: [],
                ownerMembers: [],
                cars: [],
                carMembers: [],
                contracts: [],
                repairs: [],
                visits: [],
                staffs: [],
                noData: true
            },
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('searchCommunityDataModel', '_loadData', function (_param) {
                $that._clearSearchCommunityData();
                //$('#searchCommunityDataModel').modal('show');
            });
        },
        methods: {
            _doSearchCommunityData: function () {
                if (!vc.isNotEmpty($that.searchCommunityDataInfo.searchValue)) {
                    vc.toast('请输入查询条件');
                    return;
                }
                // 清理信息
                let _param = {
                    params: {
                        searchValue: $that.searchCommunityDataInfo.searchValue,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/search.searchCommunityData',
                    _param,
                    function (json, res) {
                        let _ownerJson = JSON.parse(json);
                        if (_ownerJson.code != 0) {
                            vc.toast(_ownerJson.msg);
                            return;
                        }
                        $that.searchCommunityDataInfo.noData = false;
                        _ownerJson = _ownerJson.data;
                        $that.searchCommunityDataInfo.rooms = _ownerJson.rooms;
                        $that.searchCommunityDataInfo.owners = _ownerJson.owners;
                        $that.searchCommunityDataInfo.ownerMembers = _ownerJson.ownerMembers;
                        $that.searchCommunityDataInfo.cars = _ownerJson.cars;
                        $that.searchCommunityDataInfo.carMembers = _ownerJson.carMembers;
                        $that.searchCommunityDataInfo.contracts = _ownerJson.contracts;
                        $that.searchCommunityDataInfo.repairs = _ownerJson.repairs;
                        $that.searchCommunityDataInfo.visits = _ownerJson.visitDtos;
                        $that.searchCommunityDataInfo.staffs = _ownerJson.staffs;
                        if (_ownerJson.rooms.length < 1 && _ownerJson.owners.length < 1 && _ownerJson.ownerMembers.length < 1
                            && _ownerJson.cars.length < 1 && _ownerJson.carMembers.length < 1 && _ownerJson.contracts.length < 1
                            && _ownerJson.repairs.length < 1 && _ownerJson.visitDtos.length < 1 && _ownerJson.staffs.length < 1
                        ) {
                            $that.searchCommunityDataInfo.noData = true;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toSimplifyAcceptance: function (_room) {
                let _date = new Date();
                vc.saveData("JAVA110_IS_BACK", _date.getTime());
                vc.saveData('simplifyAcceptanceSearch', {
                    searchType: '1',
                    searchValue: _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum,
                    searchPlaceholder: '请输入房屋编号 楼栋-单元-房屋 如1-1-1',
                })
                window.open('/#/pages/property/simplifyAcceptance?tab=业务受理');
            },
            _clearSearchCommunityData: function () {
                $that.searchCommunityDataInfo = {
                    searchValue: '',
                    noData: true,
                    rooms: [],
                    owners: [],
                    ownerMembers: [],
                    cars: [],
                    carMembers: [],
                    contracts: [],
                    repairs: [],
                    visits: [],
                    staffs: [],
                };
            }
        }
    });

})(window.vc);