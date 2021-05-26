/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            storeInfoManageInfo:{
                storeInfos:[],
                total:0,
                records:1,
                moreCondition:false,
                name:'',
                componentShow:'storeInfoManage',
                conditions:{
                    name:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listStoreInfos(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('storeInfoManage','listStoreInfo',function(_param){
                $that.storeInfoManageInfo.componentShow = 'storeInfoManage';
                  vc.component._listStoreInfos(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listStoreInfos(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listStoreInfos:function(_page, _rows){

                vc.component.storeInfoManageInfo.conditions.page = _page;
                vc.component.storeInfoManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.storeInfoManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/storeInfo/queryStoreInfo',
                             param,
                             function(json,res){
                                var _storeInfoManageInfo=JSON.parse(json);
                                vc.component.storeInfoManageInfo.total = _storeInfoManageInfo.total;
                                vc.component.storeInfoManageInfo.records = _storeInfoManageInfo.records;
                                vc.component.storeInfoManageInfo.storeInfos = _storeInfoManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.storeInfoManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddStoreInfoModal:function(){
                $that.storeInfoManageInfo.componentShow = 'addStoreInfo';
                //vc.emit('addStoreInfo','openAddStoreInfoModal',{});
            },
            _openEditStoreInfoModel:function(_storeInfo){
                $that.storeInfoManageInfo.componentShow = 'editStoreInfo';
                vc.emit('editStoreInfo','openEditStoreInfoModal',_storeInfo);
            },
            _openDeleteStoreInfoModel:function(_storeInfo){
                vc.emit('deleteStoreInfo','openDeleteStoreInfoModal',_storeInfo);
            },
            _queryStoreInfoMethod:function(){
                vc.component._listStoreInfos(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.storeInfoManageInfo.moreCondition){
                    vc.component.storeInfoManageInfo.moreCondition = false;
                }else{
                    vc.component.storeInfoManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
