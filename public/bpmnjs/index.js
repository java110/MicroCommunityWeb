/**
 入驻小区
 **/
(function (vc) {

    let _doSaveDiagram = function (_xml) {
        //发送get请求
        let _modelId = vc.getParam('modelId');
        vc.http.apiPost('/activiti/model/' + _modelId + '/save',
            { 'xml': _xml },
            function (json, res) {
                var listRoomData = JSON.parse(json);

            }, function (errInfo, error) {
                console.log('请求失败处理');
            }
        );
    }

    let saveXml = function (_xml) {
        console.log(_xml);
        _doSaveDiagram(_xml);
    };
    document.body.addEventListener('saveDiagram', (_data) => {
        saveXml(_data.detail);
    });
})(window.vc);