(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 5;
    vc.extends({
        propTypes: {
            emitChooseEquipmentAccount: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseEquipmentAccountInfo: {
                typeId:'',
                selectFlag:false,
                equipmentAccounts: [],
                curEqu:{},
                _currentEquipmentAccountName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseEquipmentAccount', 'openChooseEquipmentAccountModel', function (_param) {
                // $('#chooseEquipmentAccountModel').modal('show');
                
            });
            //$('#chooseEquipmentAccountModel').modal('show');
            vc.component._refreshChooseEquipmentAccountInfo();
            vc.component._loadAllEquipmentAccountInfo(DEFAULT_PAGE, DEFAULT_ROW, '');

            vc.on('chooseEquipmentAccount', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllEquipmentAccountInfo(_currentPage, DEFAULT_ROW, '');
            });
            vc.on('chooseEquipmentAccount', 'switchMachineType', function(_type) {
                console.log(_type);
               vc.component.chooseEquipmentAccountInfo.typeId = _type.typeId;
            });

        },
        methods: {
            _loadAllEquipmentAccountInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        machineName: _name,
                        typeId:vc.component.chooseEquipmentAccountInfo.typeId
                    }
                };
                //发送get请求
                vc.http.apiGet('equipmentAccount.listEquipmentAccount',
                    param,
                    function (json) {
                        var _equipmentAccountInfo = JSON.parse(json);
                        vc.component.chooseEquipmentAccountInfo.total = _equipmentAccountInfo.total;
                        vc.component.chooseEquipmentAccountInfo.records = _equipmentAccountInfo.records;
                        vc.component.chooseEquipmentAccountInfo.equipmentAccounts = _equipmentAccountInfo.data;
                        vc.emit('chooseEquipmentAccount','paginationPlus', 'init', {
                            total: vc.component.chooseEquipmentAccountInfo.records,
                            dataCount: vc.component.chooseEquipmentAccountInfo.total,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseEquipmentAccount: function (_equipmentAccount) {
                vc.component.chooseEquipmentAccountInfo.curEqu = _equipmentAccount;
                console.log(vc.component.chooseEquipmentAccountInfo.curEqu);
                vc.emit($props.emitChooseEquipmentAccount, 'chooseEquipmentAccount', _equipmentAccount);
                vc.emit($props.emitLoadData, 'listEquipmentAccountData', {
                    equipmentAccountId: _equipmentAccount.equipmentAccountId
                });
                $that.chooseEquipmentAccountInfo.selectFlag = false;
            },
            queryEquipmentAccounts: function () {
                vc.component._loadAllEquipmentAccountInfo(DEFAULT_PAGE, DEFAULT_ROW, vc.component.chooseEquipmentAccountInfo._currentEquipmentAccountName);
            },
            _refreshChooseEquipmentAccountInfo: function () {
                vc.component.chooseEquipmentAccountInfo._currentEquipmentAccountName = "";
            },
            // _doChooseOrg: function() {
            //     vc.emit($props.callBackListener, 'switchSpace', $that.chooseEquipmentAccountInfo.curEqu);
            //     $that.chooseEquipmentAccountInfo.selectFlag = false;
            // },
            _changeEqu: function() {
                $that.chooseEquipmentAccountInfo.selectFlag = true;
              //  $that._loadChooseOrgs2();
            }
        }

    });
})(window.vc);
