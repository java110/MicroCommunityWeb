/**
 入驻小区
 https://www.cnblogs.com/zsg88/p/12552378.html
 **/
(function (vc) {

    let _doSaveDiagram = function (_xml, svg) {
        //发送get请求
        let _modelId = vc.getParam('modelId');
        let _param = {
            'xml': _xml.replaceAll('Process_1', "java110_" + vc.getParam('flowId')),
            'svg': svg
        };
        vc.http.apiPost('/activiti/model/' + _modelId + '/save',
            JSON.stringify(_param),
            {
                emulateJSON: true
            },
            function (json, res) {
                let listRoomData = JSON.parse(json);
                console.log(json)
                if (listRoomData.code == 0) {
                    vc.toast('保存成功');
                    window.close();
                }

            }, function (errInfo, error) {
                console.log('请求失败处理');
            }
        );
    }

    let saveXml = function (_xml) {
        _doSaveDiagram(_xml.xml, _xml.svg);
    };
    document.body.addEventListener('saveDiagram', (_data) => {
        saveXml(_data.detail);
    });

    _initBpmn = function () {
        let _flowId = vc.getParam('flowId');
        let _param = {
            params: {
                flowId: _flowId,
                page: 1,
                row: 1
            }
        }
        vc.http.apiGet('/oaWorkflow/queryOaWorkflowXml',
            _param,
            function (json, res) {
                let _flowXml = JSON.parse(json);
                if (_flowXml.data.length > 0) {
                    //初始化
                    window.initBpmnjs(_flowXml.data[0].bpmnXml);
                    return;
                }
                //初始化
                window.initBpmnjs();
            }, function (errInfo, error) {
                console.log('请求失败处理');
            }
        );
    }

    _initBpmn();

    _closeBpmnjs = function () {
        window.close();
    }
})(window.vc);