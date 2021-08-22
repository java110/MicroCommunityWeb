/**
 入驻小区
 **/
(function (vc) {

    const default_json = {
        "schemaVersion": 1,
        "exporter": {
            "name": "form-js",
            "version": "0.1.0"
        },
        "components": [
        ],
        "type": "default"
    };

    window.formEditor = new FormEditor.FormEditor({
        container: document.querySelector('#form')
    });

    let _doSaveDiagram = function (_xml, svg) {
        //发送get请求
        let _modelId = vc.getParam('modelId');
        let _param = {
            'xml': _xml,
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
    initFormJs = function (_context) {
        try {
             formEditor.importSchema(_context);
        } catch (err) {
            console.log('importing form failed', err);
        }
    };

    window._getSchema = function(){
        const schema = formEditor.saveSchema();
        console.log('exported schema', JSON.stringify(schema));
    }

    _initFormJs = function () {
        let _flowId = vc.getParam('flowId');
        let _param = {
            params: {
                flowId: _flowId,
                page: 1,
                row: 1
            }
        }
        vc.http.apiGet('/oaWorkflow/queryOaWorkflowForm',
            _param,
            function (json, res) {
                let _flowXml = JSON.parse(json);
                if (_flowXml.data.length > 0) {
                    //初始化
                    initFormJs(_flowXml.data[0].bpmnXml);
                    return;
                }
                //初始化
                window.initFormJs(default_json);
            }, function (errInfo, error) {
                console.log('请求失败处理');
            }
        );
    }
    _initFormJs();

    _closeBpmnjs = function () {
        window.close();
    }
})(window.vc);