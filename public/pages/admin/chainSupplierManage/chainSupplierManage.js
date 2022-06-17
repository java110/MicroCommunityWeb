/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            chainSupplierManageInfo:{
                chainSuppliers:[],
                total:0,
                records:1,
                moreCondition:false,
                csId:'',
                conditions:{
                    name:'',
url:'',
mchId:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listChainSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('chainSupplierManage','listChainSupplier',function(_param){
                  vc.component._listChainSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listChainSuppliers(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listChainSuppliers:function(_page, _rows){

                vc.component.chainSupplierManageInfo.conditions.page = _page;
                vc.component.chainSupplierManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.chainSupplierManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('chainSupplier.listChainSuppliers',
                             param,
                             function(json,res){
                                var _chainSupplierManageInfo=JSON.parse(json);
                                vc.component.chainSupplierManageInfo.total = _chainSupplierManageInfo.total;
                                vc.component.chainSupplierManageInfo.records = _chainSupplierManageInfo.records;
                                vc.component.chainSupplierManageInfo.chainSuppliers = _chainSupplierManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.chainSupplierManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddChainSupplierModal:function(){
                vc.emit('addChainSupplier','openAddChainSupplierModal',{});
            },
            _openEditChainSupplierModel:function(_chainSupplier){
                vc.emit('editChainSupplier','openEditChainSupplierModal',_chainSupplier);
            },
            _openDeleteChainSupplierModel:function(_chainSupplier){
                vc.emit('deleteChainSupplier','openDeleteChainSupplierModal',_chainSupplier);
            },
            _queryChainSupplierMethod:function(){
                vc.component._listChainSuppliers(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.chainSupplierManageInfo.moreCondition){
                    vc.component.chainSupplierManageInfo.moreCondition = false;
                }else{
                    vc.component.chainSupplierManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
