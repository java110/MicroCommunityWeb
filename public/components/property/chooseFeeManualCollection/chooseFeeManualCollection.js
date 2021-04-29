(function(vc){
    vc.extends({
        propTypes: {
           emitChooseFeeManualCollection:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseFeeManualCollectionInfo:{
                feeManualCollections:[],
                _currentFeeManualCollectionName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseFeeManualCollection','openChooseFeeManualCollectionModel',function(_param){
                $('#chooseFeeManualCollectionModel').modal('show');
                vc.component._refreshChooseFeeManualCollectionInfo();
                vc.component._loadAllFeeManualCollectionInfo(1,10,'');
            });
        },
        methods:{
            _loadAllFeeManualCollectionInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('feeManualCollection.listFeeManualCollections',
                             param,
                             function(json){
                                var _feeManualCollectionInfo = JSON.parse(json);
                                vc.component.chooseFeeManualCollectionInfo.feeManualCollections = _feeManualCollectionInfo.feeManualCollections;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseFeeManualCollection:function(_feeManualCollection){
                if(_feeManualCollection.hasOwnProperty('name')){
                     _feeManualCollection.feeManualCollectionName = _feeManualCollection.name;
                }
                vc.emit($props.emitChooseFeeManualCollection,'chooseFeeManualCollection',_feeManualCollection);
                vc.emit($props.emitLoadData,'listFeeManualCollectionData',{
                    feeManualCollectionId:_feeManualCollection.feeManualCollectionId
                });
                $('#chooseFeeManualCollectionModel').modal('hide');
            },
            queryFeeManualCollections:function(){
                vc.component._loadAllFeeManualCollectionInfo(1,10,vc.component.chooseFeeManualCollectionInfo._currentFeeManualCollectionName);
            },
            _refreshChooseFeeManualCollectionInfo:function(){
                vc.component.chooseFeeManualCollectionInfo._currentFeeManualCollectionName = "";
            }
        }

    });
})(window.vc);
