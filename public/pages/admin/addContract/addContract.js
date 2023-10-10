(function (vc) {
    vc.extends({
        data: {
            addContractInfo: {
                contractId: '',
                contractName: '',
                contractCode: '',
                contractType: '',
                partyA: '',
                partyB: '',
                aContacts: '',
                bContacts: '',
                aLink: '',
                bLink: '',
                operator: '',
                operatorLink: '',
                allNum: '',
                amount: '',
                startTime: '',
                endTime: '',
                signingTime: '',
                contractTypes: [],
                contractTypeSpecs: [],
                roomId: '',
                ownerName: '',
                link: '',
                objType: '1111',
                objId: '-1',
                contractParentId: '',
                parentContractCode: '',
                parentContractName: '',
                parentStateName: '',
                objName: '',
                objPersonName: '',
                objPersonId: '',
                rooms: [],
                contractFilePo: [],
                tempfile: '',
                contractPartyAs: [],
                audit: '',
                staffName: '',
                nextUserId: ''
            }
        },
        _initMethod: function () {
            $that._loadAddContractType();
            $that._loadAddContractParkA();
            if (vc.getParam("contractId")) {
                $that.addContractInfo.contractParentId = vc.getParam("contractId");
                $that.addContractInfo.parentContractCode = vc.getParam("contractCode");
                $that.addContractInfo.parentContractName = vc.getParam("contractName");
                $that.addContractInfo.parentStateName = vc.getParam("stateName");
                $that.addContractInfo.contractId = '';
                $that.addContractInfo.contractCode = '';
                $that.addContractInfo.contractName = '';
                $that.addContractInfo.allNum = vc.getParam("objId");
                $that._queryRoom();
                $that._listContracts();
            }
            vc.initDateTime('addStartTime', function (_value) {
                $that.addContractInfo.startTime = _value;
            });
            vc.initDateTime('addEndTime', function (_value) {
                $that.addContractInfo.endTime = _value;
            });
            vc.initDateTime('addSigningTime', function (_value) {
                $that.addContractInfo.signingTime = _value;
            });
            $that.addContractInfo.signingTime = vc.dateTimeFormat(new Date().getTime());
        },
        _initEvent: function () {
            vc.on('addContract', 'chooseRoom', function (param) {
                $that.addContractInfo.rooms.push(param);
            })
            vc.on('addContract', 'chooseOwner', function (param) {
                $that.addContractInfo.partyB = param.name;
                $that.addContractInfo.bContacts = param.name;
                $that.addContractInfo.bLink = param.link;
                $that.addContractInfo.objId = param.ownerId;
            })
            vc.on("addContract", "notify3", function (info) {
                $that.addContractInfo.nextUserId = info.staffId;
                $that.addContractInfo.staffName = info.staffName;
            });
        },
        methods: {
            addContractValidate() {
                return vc.validate.validate({
                    addContractInfo: $that.addContractInfo
                }, {
                    'addContractInfo.contractName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "合同名称不能超过64位"
                        },
                    ],
                    'addContractInfo.contractCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "合同编号错误"
                        },
                    ],
                    'addContractInfo.contractType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "合同类型格式错误"
                        },
                    ],
                    'addContractInfo.partyA': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "甲方名称太长"
                        },
                    ],
                    'addContractInfo.partyB': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "乙方不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "乙方名称太长"
                        },
                    ],
                    'addContractInfo.aContacts': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "甲方联系人长度超过64位"
                        },
                    ],
                    'addContractInfo.bContacts': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "乙方联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "乙方联系人长度超过64位"
                        },
                    ],
                    'addContractInfo.aLink': [{
                        limit: "required",
                        param: "",
                        errInfo: "甲方联系电话不能为空"
                    }],
                    'addContractInfo.bLink': [{
                        limit: "required",
                        param: "",
                        errInfo: "乙方联系电话不能为空"
                    }],
                    'addContractInfo.operator': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "经办人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "经办人超过64位"
                        },
                    ],
                    'addContractInfo.operatorLink': [{
                        limit: "required",
                        param: "",
                        errInfo: "联系电话不能为空"
                    }],
                    'addContractInfo.amount': [{
                        limit: "money",
                        param: "",
                        errInfo: "合同金额格式错误，如1.50"
                    }],
                    'addContractInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同开始时间格式错误"
                        },
                    ],
                    'addContractInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同结束时间格式错误"
                        },
                    ],
                    'addContractInfo.signingTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "合同签订时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同签订时间格式错误"
                        },
                    ]
                });
            },
            _queryRoom: function () {
                let param = {
                    params: {
                        contractId: vc.getParam("contractId"),
                        page: 1,
                        row: 100
                    }
                }
                //发送get请求
                vc.http.apiGet('/contract/queryContractRoom',
                    param,
                    function (json, res) {
                        var _contractTFile = JSON.parse(json);
                        $that.addContractInfo.rooms = _contractTFile.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            saveContractInfo: function () {
                if (!$that.addContractValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addContractInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/contract/saveContract',
                    JSON.stringify($that.addContractInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            $that._goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddContractInfo: function () {
                let _contractTypes = $that.addContractInfo.contractTypes;
                $that.addContractInfo = {
                    contractName: '',
                    contractCode: '',
                    contractType: '',
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
                    contractTypes: _contractTypes,
                    contractTypeSpecs: [],
                    allNum: '',
                    roomId: '',
                    ownerName: '',
                    link: '',
                    objId: '-1',
                    objType: '1111',
                    contractParentId: '',
                    parentContractCode: '',
                    parentContractName: '',
                    parentStateName: '',
                    objName: '',
                    objPersonName: '',
                    objPersonId: '',
                    rooms: [],
                    contractPartyAs: [],
                    audit: '',
                    staffName: '',
                    nextUserId: ''
                };
            },
            _loadAddContractType: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                }
                //发送get请求
                vc.http.apiGet('/contract/queryContractType',
                    param,
                    function (json, res) {
                        var _contractTypeManageInfo = JSON.parse(json);
                        $that.addContractInfo.contractTypes = _contractTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadAddContractParkA: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                }
                //发送get请求
                vc.http.apiGet('/contractPartya/queryContractPartya',
                    param,
                    function (json, res) {
                        var _contractTypeManageInfo = JSON.parse(json);
                        $that.addContractInfo.contractPartyAs = _contractTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeContractType: function () {
                $that.addContractInfo.contractTypes.forEach(item => {
                    if ($that.addContractInfo.contractType == item.contractTypeId) {
                        $that.addContractInfo.audit = item.audit;
                    }
                })
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        contractTypeId: $that.addContractInfo.contractType
                    }
                }
                $that.addContractInfo.contractTypeSpecs = [];
                vc.http.apiGet('/contract/queryContractTypeSpec',
                    param,
                    function (json, res) {
                        let _contractTypeSpecManageInfo = JSON.parse(json);
                        _contractTypeSpecManageInfo.data.forEach(item => {
                            item.value = '';
                            if (item.specShow == 'Y') {
                                item.values = [];
                                //$that._loadAttrValue(item.specCd, item.values);
                                $that.addContractInfo.contractTypeSpecs.push(item);
                            }
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            },
            _selectRoom: function () {
                vc.emit('searchRoom', 'openSearchRoomModel', {})
            },
            _openDelRoomModel: function (_room) {
                let _tmpRooms = [];
                $that.addContractInfo.rooms.forEach(item => {
                    if (item.roomId != _room.roomId) {
                        _tmpRooms.push(item);
                    }
                });
                $that.addContractInfo.rooms = _tmpRooms;
            },
            addFileStep: function () {
                let _file = {
                    seq: $that.addContractInfo.contractFilePo.length,
                    fileSaveName: '',
                    fileRealName: ''
                }
                $that.addContractInfo.contractFilePo.push(_file);
            },
            deleteStep: function (_step) {
                for (var i = 0; i < $that.addContractInfo.contractFilePo.length; i++) {
                    if ($that.addContractInfo.contractFilePo[i].seq == _step.seq) {

                        $that.addContractInfo.contractFilePo.splice(i, 1);
                    }
                }
            },
            getFile: function (e, index) {
                $that.addContractInfo.tempfile = e.target.files[0];
                $that.addContractInfo.contractFilePo[index].fileRealName = $that.addContractInfo.tempfile.name;
                this._importData(index);
            },
            _importData: function (index) {
                // 导入数据
                let _fileName = $that.addContractInfo.tempfile.name;
                let _suffix = _fileName.substring(_fileName.lastIndexOf('.') + 1);
                if (!$that.checkFileType(_suffix.toLowerCase())) {
                    vc.toast('操作失败，请上传图片、PDF格式的文件');
                    return;
                }
                let param = new FormData();
                param.append("uploadFile", $that.addContractInfo.tempfile);
                vc.http.upload(
                    'importRoomFee',
                    'uploadContactFile',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            $that.addContractInfo.contractFilePo[index].fileSaveName = json;
                            vc.toast("上传成功");
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            checkFileType: function (fileType) {
                const acceptTypes = ['png', 'pdf', 'jpg'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            },
            _changeContractPartyA: function () {
                let _partyA = $that.addContractInfo.partyA;
                $that.addContractInfo.contractPartyAs.forEach(item => {
                    if (_partyA == item.partyA) {
                        $that.addContractInfo.aLink = item.aLink;
                        $that.addContractInfo.aContacts = item.aContacts;
                    }
                })
            },
            _searchOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            _listContracts: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        contractId: vc.getParam('contractId')
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json, res) {
                        let _expirationContractInfo = JSON.parse(json);
                        vc.copyObject(_expirationContractInfo.data[0], $that.addContractInfo);
                        $that.addContractInfo.contractId = '';
                        $that.addContractInfo.contractCode = '';
                        $that.addContractInfo.contractName = '';
                        $that.addContractInfo.startTime = $that.addContractInfo.endTime;
                        $that.addContractInfo.endTime = '';
                        $that.addContractInfo.signingTime = '';
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);