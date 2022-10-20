/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            downloadTempFileInfo: {
                files: [],
                total: 0,
                records: 1,
                moreCondition: false,
                pageId: '',
                conditions: {
                    pageId: '',
                    pageName: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listFiles(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('downloadTempFile', 'listFile', function(_param) {
                vc.component._listFiles(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listFiles(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFiles: function(_page, _rows) {

                vc.component.downloadTempFileInfo.conditions.page = _page;
                vc.component.downloadTempFileInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.downloadTempFileInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/userDownloadFile.listUserDownloadFile',
                    param,
                    function(json, res) {
                        var _downloadTempFileInfo = JSON.parse(json);
                        vc.component.downloadTempFileInfo.total = _downloadTempFileInfo.total;
                        vc.component.downloadTempFileInfo.records = _downloadTempFileInfo.records;
                        vc.component.downloadTempFileInfo.files = _downloadTempFileInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.downloadTempFileInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _downLoadFile: function(_file) {
                if (!_file.tempUrl) {
                    vc.toast('下载失败');
                    return;
                }
                vc.jumpToPage(_file.downloadUrl)
            },
            _openDeleteFileModel: function(_file) {
                vc.emit('deteteDownloadTempFile', 'openDeteteDownloadTempFileModal', _file);
            },
            _queryDownloadTempFileMethod: function() {
                vc.component._listFiles(DEFAULT_PAGE, DEFAULT_ROWS);

            },

            _moreCondition: function() {
                if (vc.component.downloadTempFileInfo.moreCondition) {
                    vc.component.downloadTempFileInfo.moreCondition = false;
                } else {
                    vc.component.downloadTempFileInfo.moreCondition = true;
                }
            },



        }
    });
})(window.vc);