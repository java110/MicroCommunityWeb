/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            printCommonReportTableInfo: {}
        },
        _initMethod: function() {
            $that.printCommonReportTableInfo = vc.getData('printCommonReportTableData')

        },
        methods: {
            _printPurchaseApplyDiv: function() {

                $that.printFlag = '1';
                console.log('console.log($that.printFlag);', $that.printFlag);
                document.getElementById("print-btn").style.display = "none"; //隐藏

                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function() {
                window.opener = null;
                window.close();
            },
        }
    });
})(window.vc);