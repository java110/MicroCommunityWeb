(function(vc){
    vc.extends({
        propTypes: {
           emitChooseStoreInfo:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseStoreInfoInfo:{
                storeInfos:[],
                _currentStoreInfoName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseStoreInfo','openChooseStoreInfoModel',function(_param){
                $('#chooseStoreInfoModel').modal('show');
                vc.component._refreshChooseStoreInfoInfo();
                vc.component._loadAllStoreInfoInfo(1,10,'');
            });
        },
        methods:{
            _loadAllStoreInfoInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('storeInfo.listStoreInfos',
                             param,
                             function(json){
                                var _storeInfoInfo = JSON.parse(json);
                                vc.component.chooseStoreInfoInfo.storeInfos = _storeInfoInfo.storeInfos;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseStoreInfo:function(_storeInfo){
                if(_storeInfo.hasOwnProperty('name')){
                     _storeInfo.storeInfoName = _storeInfo.name;
                }
                vc.emit($props.emitChooseStoreInfo,'chooseStoreInfo',_storeInfo);
                vc.emit($props.emitLoadData,'listStoreInfoData',{
                    storeInfoId:_storeInfo.storeInfoId
                });
                $('#chooseStoreInfoModel').modal('hide');
            },
            queryStoreInfos:function(){
                vc.component._loadAllStoreInfoInfo(1,10,vc.component.chooseStoreInfoInfo._currentStoreInfoName);
            },
            _refreshChooseStoreInfoInfo:function(){
                vc.component.chooseStoreInfoInfo._currentStoreInfoName = "";
            }
        }

    });
})(window.vc);
