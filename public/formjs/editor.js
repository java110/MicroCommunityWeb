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

    _doSaveDiagram = function (_xml, svg) {
        let _param = {
            'formJson': JSON.stringify(formEditor.saveSchema()),
            'flowId': vc.getParam('flowId')
        };
        vc.http.apiPost('/oaWorkflow/saveOaWorkflowForm',
            JSON.stringify(_param),
            {
                emulateJSON: true
            },
            function (json, res) {
                let listRoomData = JSON.parse(json);
                vc.toast(listRoomData.msg);
                if (listRoomData.code == 0) {
                    window.close();
                }
            }, function (errInfo, error) {
                console.log('请求失败处理');
            }
        );
    }
    initFormJs = function (_context) {
        try {
            console.log(_context)
            formEditor.importSchema(_context);
        } catch (err) {
            console.log('importing form failed', err);
        }
    };

    window._getSchema = function () {
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
                    initFormJs(JSON.parse(_flowXml.data[0].formJson));
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