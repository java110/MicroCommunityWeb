/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    var TEMP_SEARCH = 'contractCreateFeeSearch';
    vc.extends({
        data: {
            roomUnits: [],
            contractCreateFeeInfo: {
                contracts: [],
                total: 0,
                records: 1,
                floorId: '',
                unitId: '',
                state: '',
                roomNum: '',
                moreCondition: false,
                conditions: {
                    contractName: '',
                    contractCode: '',
                    contractType: ''
                }
            },
            currentPage: 1,
        },
        _initMethod: function () {
            //检查是否有缓存数据
            let _tempData = vc.getData(TEMP_SEARCH);
            if (_tempData == null) {
                vc.component.contractCreateFeeInfo.conditions.floorId = vc.getParam("floorId");
                vc.component.contractCreateFeeInfo.conditions.floorName = vc.getParam("floorName");
                vc.component.listContract(DEFAULT_PAGE, DEFAULT_ROW);
            } else {
                console.log('here is tempData : ', _tempData);
                vc.component.contractCreateFeeInfo.conditions = _tempData.conditions;
                $that.updateCurrentPage(_tempData.currentPage);
                vc.component.listContract(_tempData.currentPage, DEFAULT_ROW);
            }
        },
        _initEvent: function () {
            vc.on('room', 'chooseFloor', function (_param) {
                vc.component.contractCreateFeeInfo.conditions.floorId = _param.floorId;
                vc.component.contractCreateFeeInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that.updateCurrentPage(_currentPage);
                vc.component.listContract(_currentPage, DEFAULT_ROW);
            });
        },
        methods: {
            listContract: function (_page, _row) {
                vc.component.contractCreateFeeInfo.conditions.page = _page;
                vc.component.contractCreateFeeInfo.conditions.row = _row;
                vc.component.contractCreateFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.contractCreateFeeInfo.conditions.contractName = vc.component.contractCreateFeeInfo.conditions.contractName.trim();
                vc.component.contractCreateFeeInfo.conditions.contractCode = vc.component.contractCreateFeeInfo.conditions.contractCode.trim();
                vc.component.contractCreateFeeInfo.conditions.contractType = vc.component.contractCreateFeeInfo.conditions.contractType.trim();
                let _conditions = JSON.parse(JSON.stringify(vc.component.contractCreateFeeInfo.conditions));
                let param = {
                    params: _conditions
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json, res) {
                        var listContractData = JSON.parse(json);
                        vc.component.contractCreateFeeInfo.total = listContractData.total;
                        vc.component.contractCreateFeeInfo.records = listContractData.records;
                        vc.component.contractCreateFeeInfo.contracts = listContractData.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractCreateFeeInfo.records,
                            dataCount: vc.component.contractCreateFeeInfo.total,
                            currentPage: _page
                        });
                        // 换存搜索条件
                        $that.saveTempSearchData();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openViewRoomCreateFee: function (_contract) {
                vc.jumpToPage("/#/pages/property/listContractFee?contractId=" + _contract.contractId + "&contractCode=" + _contract.contractCode);
            },
            //查询
            _queryRoomMethod: function () {
                // 搜索时重置缓存分页
                $that.updateCurrentPage(DEFAULT_PAGE);
                vc.component.listContract(DEFAULT_PAGE, DEFAULT_ROW);
            },
            //重置
            _resetRoomMethod: function () {
                vc.component.contractCreateFeeInfo.conditions.contractName = "";
                vc.component.contractCreateFeeInfo.conditions.contractCode = "";
                vc.component.contractCreateFeeInfo.conditions.contractType = "";
                // 搜索时重置缓存分页
                $that.updateCurrentPage(DEFAULT_PAGE);
                vc.component.listContract(DEFAULT_PAGE, DEFAULT_ROW);
            },
            _moreCondition: function () {
                if (vc.component.contractCreateFeeInfo.moreCondition) {
                    vc.component.contractCreateFeeInfo.moreCondition = false;
                } else {
                    vc.component.contractCreateFeeInfo.moreCondition = true;
                }
            },
            _toOwnerPayFee: function (_ContractFeeInfo) {
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + _ContractFeeInfo.contractId + '&payObjType=7777&contractName=' + _ContractFeeInfo.contractName);
            },
            _printOwnOrder: function (_room) {
                //打印催交单
                vc.jumpToPage('print.html#/pages/property/printOweFee?roomId=' + _room.roomId)
            },
            _openTranslateFeeManualCollectionDetailModel: function (_room) {
                let _data = {
                    roomId: _room.roomId,
                    communityId: vc.getCurrentCommunity().communityId
                }
                //重新同步房屋欠费
                vc.http.apiPost(
                    '/feeManualCollection/saveFeeManualCollection',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast(_json.msg);
                            vc.jumpToPage('/#/pages/property/feeManualCollectionManage');
                            vc.toast(_json.msg);
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    }
                );
            },
            /**
             * 更新当前页码
             */
            updateCurrentPage: function (page) {
                $that.currentPage = page;
            },
            /**
             * 保存搜索条件、页码
             */
            saveTempSearchData: function () {
                let conditions = $that.contractCreateFeeInfo.conditions;
                //缓存起来=
                vc.saveData(TEMP_SEARCH, {
                    conditions: conditions,
                    currentPage: $that.currentPage
                });
            },
            _downloadCollectionLetterOrder: function () {
                vc.jumpToPage('/callComponent/feeManualCollection/downloadCollectionLetterOrder?communityId=' + vc.getCurrentCommunity().communityId);
            },
            _downloadRoomCollectionLetterOrder: function (_room) {
                vc.jumpToPage('/callComponent/feeManualCollection/downloadCollectionLetterOrder?communityId=' + vc.getCurrentCommunity().communityId + "&roomId=" + _room.roomId);
            },
            _viewContract: function (_contract) {
                vc.jumpToPage("/#/pages/common/contractApplyDetail?contractId=" + _contract.contractId);
            },
            _openContractCreateFeeAddModal: function (_room, _isMore) {
                vc.emit('contractCreateFeeAdd', 'openContractCreateFeeAddModal', {
                    isMore: _isMore,
                    contract: _room
                });
            }
        }
    });
})(window.vc);