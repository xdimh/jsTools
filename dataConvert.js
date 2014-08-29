var data = [
  "app1", "app2",
  "app1", "app3",
  "app1", "app4",
  "app3", "app5",
  "app4", "app5",
  "app2", "app6",
  "app5", "app6"
];

// data : {
//                 "name" : 'simple-monitor',
//                 "children" : [
//                     {
//                       "name" : 'depends on1',
//                       "children" : [
//                         {"name" : "depends on3"},
//                         {"name" : "depends on4"},
//                         {"name" : "depends on5"}
//                       ]
//                     },
//                     {
//                       "name" : 'depends on2',
//                        "children" : [
//                         {"name" : "depends on3",
//                          "children" : [{"name" : "depends on6"},{"name" : "depends on7"},{"name" : "depends on8"}]},
//                         {"name" : "depends on4"},
//                         {"name" : "depends on5"}
//                       ]
//                     }
//                 ]
// }

function dataConvert(_data,_rootName) {
    var _tmpObj = {},_mark= {},
        _newFormatData;

    for(var i = 0, _len = _data.length; i < _len; i+=2) {
        
        if(!!_tmpObj[_data[i]]) {
            _tmpObj[_data[i]].push(_data[i+1]);
        } else {
            _tmpObj[_data[i]] = [_data[i+1]];
        }
    }

    function formatData(key){
        var _ta,_to = {};

        if(!!_tmpObj[key]&&!_mark[key]) {
            _ta = _tmpObj[key];
            _mark[key] = true;
            for(var i = 0,_len = _ta.length;i < _len; i++){
                _ta[i] = formatData(_ta[i]);
            }  
            return {name:key,children:_ta};
        } else {
            _to['name'] = key;
            if(_tmpObj[key]) {
                _to['children'] = _tmpObj[key];
            }
            return _to;
        }
    }

    _newFormatData = formatData('app1');

    return _newFormatData;

} 

console.log(dataConvert(data));
