(function () {

    function _loadAssetInspection() {

        let param = {
            params: {
                communityId: vc.getCurrentCommunity().communityId
            }
        }
        vc.http.apiGet(
            '/bigScreen/getAssetInspection',
            param,
            function (json, res) {
                //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                let _json = JSON.parse(json);
                if (_json.code == 0) {
                    let _data = _json.data;
                    initInspeciton(_data);
                    return;
                }
            },
            function (errInfo, error) {
                console.log('请求失败处理');

                vc.toast(errInfo);

            });
    }

    function initInspeciton(_dataArr) {
        let _todayInpection = document.getElementById("todayInpection");
        let _li = "";
        for (let _inIndex = 0; _inIndex < _dataArr.length; _inIndex++) {
            _li += "<li>" + (_inIndex + 1) + ".0、" + _dataArr[_inIndex].msg + "</li>";

            if(_inIndex >=7){
                break;
            }
        }
        _todayInpection.innerHTML = _li;
    }


    _loadAssetInspection();
})()