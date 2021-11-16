(function (vc) {

    vc.extends({
        data: {
            templatecontent: '',
            contractdata: '',
            contractTypeSpec: '',
            baseRepalce: [],
            attrs: [],
            printContractInfo: {
                contractId: '',
                contractTypeId: '',
                context: ''
            },
            printFlag: '0'
        },
        _initMethod: function () {
            //vc.component._initPrintPurchaseApplyDateInfo();

            $that.printContractInfo.contractTypeId = vc.getParam('contractTypeId');
            $that.printContractInfo.contractId = vc.getParam('contractId');

            $that._loadContract();
        },
        _initEvent: function () {


        },
        methods: {
            _initPayFee: function () {

            },
            _loadContract: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        contractId: $that.printContractInfo.contractId,
                        contractTypeId: $that.printContractInfo.contractTypeId
                    }
                };

                //发送模板get请求
                vc.http.apiGet('/contract/printContractTemplate',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        let _data = _info.data;
                        //拿到模板内容
                        $that.templatecontent = _data.contractTypeTemplate[0].context;
                        // 合同信息
                        $that.contractdata = _data.contract[0];

                        //合同属性
                        $that.attrs = _data.contract[0].attrs;
                        $that.contractTypeSpec = _data.contractTypeSpec;
                        $that.contractTypeSpec.forEach(function (e) {
                            let rname = e.specName;
                            let rspecCd = e.specCd;
                            $that.attrs.forEach(function (ea) {
                                if (rspecCd == ea.specCd) {
                                    let reg = '#' + rname + '#';
                                    $that.templatecontent = $that.templatecontent.replaceAll(reg, ea.value)
                                }
                            });
                        });
                        $that.baseRepalce = _data.baseRepalce;
                        if ($that.baseRepalce) {
                            $that.baseRepalce.forEach(function (e) {
                                let rname = e.name;
                                let rkey = e.key;
                                var contractarr = Object.keys($that.contractdata);
                                for (var a in contractarr) {
                                    if (rkey == contractarr[a]) {
                                        let reg = '#' + rname + '#';
                                        $that.templatecontent = $that.templatecontent.replaceAll(reg, $that.contractdata[contractarr[a]])
                                    }
                                }
                            });
                        }

                        $that.printContractInfo.context = $that.templatecontent;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _printContractDiv: function () {

                $that.printFlag = '1';
                console.log('console.log($that.printFlag);', $that.printFlag);
                document.getElementById("print-btn").style.display = "none";//隐藏

                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function () {
                window.opener = null;
                window.close();
            }
        }
    });

})(window.vc);
