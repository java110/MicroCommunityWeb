(function (vc) {

    vc.extends({
        data: {
            printContractInfo: {
                contractTypeId: '',
                context: ''
            },
            printFlag: '0'
        },
        _initMethod: function () {
            //vc.component._initPrintPurchaseApplyDateInfo();

            $that.printContractInfo.contractTypeId = vc.getParam('contractTypeId');

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
                        contractTypeId: $that.printContractInfo.contractTypeId
                    }
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContractTypeTemplate',
                    param,
                    function (json, res) {
                        let _info = JSON.parse(json);
                        let _data = _info.data;
                        if (_data.length > 0) {
                            $that.printContractInfo.context = _data[0].context;
                        }
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
