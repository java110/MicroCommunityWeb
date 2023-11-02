/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractDetailFileInfo: {
                files: [],
                contractId: '',
                roomNum: '',
                allOweFeeAmount: '0'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('contractDetailFile', 'switch', function (_data) {
                $that.contractDetailFileInfo.contractId = _data.contractId;
                $that._loadContractDetailFileData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadContractDetailFileData: function (_page, _row) {
                let param = {
                    params: {
                        contractId: $that.contractDetailFileInfo.contractId,
                        page: 1,
                        row: 100
                    }
                }
                //发送get请求
                vc.http.apiGet('/contractFile/queryContractFile',
                    param,
                    function (json, res) {
                        let _contractTFile = JSON.parse(json);
                        $that.contractDetailFileInfo.files = _contractTFile.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _viewFile: function (_file) {
                window.open(_file.fileSaveName);
            },
        }
    });
})(window.vc);