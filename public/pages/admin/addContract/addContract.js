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
                contractPartyAs: []
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
        },
        methods: {
            addContractValidate() {
                return vc.validate.validate({
                    addContractInfo: vc.component.addContractInfo
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
                            errInfo: "甲方联系人长度超过64位"
                        },
                    ],
                    'addContractInfo.aLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "甲方联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "甲方联系电话错误"
                        },
                    ],
                    'addContractInfo.bLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "乙方联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "乙方联系电话错误"
                        },
                    ],
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
                    'addContractInfo.operatorLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "经办人联系电话格式错误"
                        },
                    ],
                    'addContractInfo.amount': [
                        {
                            limit: "money",
                            param: "",
                            errInfo: "合同金额格式错误，如1.50"
                        },
                    ],
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
                            errInfo: "签订时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "合同签订时间格式错误"
                        },
                    ],
                });
            },
            saveContractInfo: function () {
                if (!vc.component.addContractValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addContractInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/contract/saveContract',
                    JSON.stringify(vc.component.addContractInfo),
                    {
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
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddContractInfo: function () {
                let _contractTypes = $that.addContractInfo.contractTypes;
                vc.component.addContractInfo = {
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

                    objType: '1111'
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
                        vc.component.addContractInfo.contractTypes = _contractTypeManageInfo.data;
                    }, function (errInfo, error) {
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
                        vc.component.addContractInfo.contractPartyAs = _contractTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeContractType: function () {
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
                    }, function (errInfo, error) {
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
            getFile: function (e,index) {
                vc.component.addContractInfo.tempfile = e.target.files[0];
                $that.addContractInfo.contractFilePo[index].fileRealName = vc.component.addContractInfo.tempfile.name;
                this._importData(index);
            },
            _importData: function (index) {
                // 导入数据
                let _fileName = vc.component.addContractInfo.tempfile.name;
                let _suffix = _fileName.substring(_fileName.lastIndexOf('.') + 1);
                if (!vc.component.checkFileType(_suffix.toLowerCase())) {
                    vc.toast('操作失败，请上传图片、PDF格式的文件');
                    return;
                }
           
                var param = new FormData();
                param.append("uploadFile", vc.component.addContractInfo.tempfile);
                vc.http.upload(
                    'importRoomFee',
                    'uploadContactFile',
                    param,
                    {
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
                const acceptTypes = ['png','pdf','jpg'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            },
            _changeContractPartyA:function(){
                let _partyA = $that.addContractInfo.partyA;
                $that.addContractInfo.contractPartyAs.forEach(item=>{
                    if(_partyA == item.partyA){
                        $that.addContractInfo.aLink = item.aLink;
                        $that.addContractInfo.aContacts = item.aContacts;

                    }
                })
            },
            _searchOwner:function(){
                vc.emit('searchOwner', 'openSearchOwnerModel',{});
            }
        }
    });

})(window.vc);
