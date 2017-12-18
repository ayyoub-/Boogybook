boogybookApp.factory('PSAPI', function($http, $q) {

  function PSDatas(datas_name, filters, display, index) {
    var d = $q.defer();

    var params = {
      shopURL: 'http://boogybook.com',
      WS_KEY: 'WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
    };
    params.WS_SOURCE = params.shopURL + '/api';

    var ws_params = {
      ws_key: params.WS_KEY,
      'output_format': 'JSON'
    }
    if (typeof(display) != 'undefined')
      ws_params.display = display;
    if (typeof(filters) != 'undefined') {
      for (var key in filters)
        ws_params['filter[' + key + ']'] = filters[key];
    }

    $http({
        method: 'GET',
        url: params.WS_SOURCE + '/' + datas_name,
        params: ws_params
      })
      .success(function(data, status, headers, config) {
        var key = datas_name;
        if (datas_name == 'auth') key = 'customers';
        if (typeof data[key] !== 'undefined') {
          console.log('[PSDatas#' + datas_name + '][Notice] success');
          if (typeof(index) != 'undefined') {
            if (data[key].length - 1 >= index)
              d.resolve(data[key][index]);
            else
              return d.promise;
          } else
            d.resolve(data[key]);
        } else {
          console.log('[PSDatas#' + datas_name + '][Error] No record found');
          // return d.promise;
          d.resolve({
            'errors': [{
              code: 404,
              message: 'NOT_FOUND'
            }]
          });
        }
      })
      .error(function(data, status, headers, config) {
        console.log('[PSDatas#' + datas_name + '][Error] ' + status, data);
        // alert(status+' - '+headers+ ' - ' + data);
        d.resolve({
          'errors': data
        });
        //return d.promise;
      });

    return d.promise;
  }

  function PSSyncDatas(datas_name, filters, display, index) {
    //var d = $q.defer();

    var params = {
      shopURL: 'http://boogybook.com',
      WS_KEY: 'WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
    };
    params.WS_SOURCE = params.shopURL + '/api';

    var ws_params = {
      ws_key: params.WS_KEY,
      'output_format': 'JSON'
    }
    if (typeof(display) != 'undefined')
      ws_params.display = display;
    if (typeof(filters) != 'undefined') {
      for (var key in filters)
        ws_params['filter[' + key + ']'] = filters[key];
    }

    $http({
        method: 'GET',
        url: params.WS_SOURCE + '/' + datas_name,
        params: ws_params
      })
      .success(function(data, status, headers, config) {
        var key = datas_name;
        if (datas_name == 'auth') key = 'customers';
        if (typeof data[key] !== 'undefined') {
          console.log('[PSDatas#' + datas_name + '][Notice] success');
          if (typeof(index) != 'undefined') {
            if (data[key].length - 1 >= index)
              return data[key][index];
            // else
            // return d.promise;
          } else
            return data[key];
        } else {
          console.log('[PSDatas#' + datas_name + '][Error] No record found');
          // return d.promise;
          return {
            'errors': [{
              code: 404,
              message: 'NOT_FOUND'
            }]
          };
        }
      })
      .error(function(data, status, headers, config) {
        console.log('[PSDatas#' + datas_name + '][Error] ' + status, data);
        // alert(status+' - '+headers+ ' - ' + data);
        return {
          'errors': data
        };
        //return d.promise;
      });

    // return d.promise;
  }

  function PSExecute(remote_function, extra_params) {
    var d = $q.defer();

    var params = {
      shopURL: 'http://boogybook.com',
      WS_KEY: 'WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
    };
    params.WS_SOURCE = params.shopURL + '/api';
    // params.method = 'GET';

    var ws_params = {
      ws_key: params.WS_KEY,
      'output_format': 'JSON',
      'rfunc': remote_function,
    }
    if (typeof(extra_params) != 'undefined') {
      for (var key in extra_params)
        ws_params[key] = extra_params[key];
    }

    // console.log(ws_params);

    $http({
        method: 'GET',
        url: params.WS_SOURCE + '/remote_exec',
        params: ws_params
      })
      .success(function(data, status, headers, config) {
        if (typeof data !== 'undefined') {
          console.log('[PSDatas#RemoteExec][Notice] success');
          d.resolve(data);
        } else {
          console.log('[PSDatas#RemoteExec][Error] No data found');
          return d.promise;
        }
      })
      .error(function(data, status, headers, config) {
        console.log('[PSDatas#RemoteExec][Error] ' + status, data);
        return d.promise;
      });

    return d.promise;
  }

  function PSDatasDelete(datas_name, id) {
    var d = $q.defer();

    var params = {
      shopURL: 'http://boogybook.com',
      WS_KEY: 'WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
    };
    params.WS_SOURCE = params.shopURL + '/api';

    var ws_params = {
      ws_key: params.WS_KEY,
      // 'output_format': 'JSON',
    }
    if (typeof(filters) != 'undefined') {
      for (var key in filters)
        ws_params['filter[' + key + ']'] = filters[key];
    }
    $http({
        method: 'DELETE',
        url: params.WS_SOURCE + '/' + datas_name + '/' + id,
        params: ws_params
      })
      .success(function(data, status, headers, config) {
        var key = datas_name;
        if (datas_name == 'auth') key = 'customers';
        if (typeof data[key] !== 'undefined') {
          console.log('[PSDatasDelete#' + datas_name + '][Notice] success');
          if (typeof(index) != 'undefined') {
            if (data[key].length - 1 >= index)
              d.resolve(data[key][index]);
            else
              return d.promise;
          } else
            d.resolve(data[key]);
        } else {
          console.log('[PSDatasDelete#' + datas_name + '][Error] No record found');
          d.resolve(data);
        }
      })
      .error(function(data, status, headers, config) {
        console.log('[PSDatasDelete#' + datas_name + '][Error] ' + status + ' - ' + data);
        d.resolve(data);
      });

    return d.promise;
  }

  function PSDatasUpdate(datas_name, datas, json) {
    var d = $q.defer();

    var params = {
      shopURL: 'http://boogybook.com',
      WS_KEY: 'WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
    };
    params.WS_SOURCE = params.shopURL + '/api';

    var ws_params = {
      ws_key: params.WS_KEY,
      'output_format': 'JSON'
    }
    if (typeof(json) != 'undefined' && json == 1) {
      xml = '<?xml version="1.0"?>';
      xml += '<prestashop>';
      xml += '<' + datas_name + '>';
      for (var key in datas) {
        if (key[0] != '$') {
          xml += '<' + key + '><![CDATA[';
          xml += datas[key];
          xml += ']]></' + key + '>';
        }
      }
      xml += '</' + datas_name + '>';
      xml += '</prestashop>';
    } else
      xml = datas;

    $http({
        method: 'PUT',
        url: params.WS_SOURCE + '/' + datas_name,
        params: ws_params,
        data: 'xml=' + xml
      })
      .success(function(data, status, headers, config) {
        // console.log('[PSDatasUpdate#'+datas_name+'] '+status, data);
        d.resolve(data);
      })
      .error(function(data, status, headers, config) {
        // console.log('[PSDatasUpdate#'+datas_name+'][Error] '+status, data);
        return d.promise;
      });

    return d.promise;
  }


  function PSDatasAdd(datas_name, datas, json) {
    var d = $q.defer();

    var params = {
      shopURL: 'http://boogybook.com',
      WS_KEY: 'WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
    };
    params.WS_SOURCE = params.shopURL + '/api';

    var ws_params = {
      ws_key: params.WS_KEY,
      'output_format': 'JSON'
    }

    if (typeof(json) != 'undefined' && json == 1) {
      xml = '<?xml version="1.0"?>';
      xml += '<prestashop>';
      xml += '<' + datas_name + '>';
      for (var key in datas) {
        if (key[0] != '$') {
          xml += '<' + key + '><![CDATA[';
          xml += datas[key];
          xml += ']]></' + key + '>';
        }
      }
      xml += '</' + datas_name + '>';
      xml += '</prestashop>';
    } else
      xml = datas;

    $http({
        method: 'POST',
        url: params.WS_SOURCE + '/' + datas_name,
        params: ws_params,
        data: 'xml=' + xml
      })
      .success(function(data, status, headers, config) {
        console.log('[PSDatasAdd#' + datas_name + '] ' + status, data);
        d.resolve(data);
      })
      .error(function(data, status, headers, config) {
        console.log('[PSDatasAdd#' + datas_name + '][Error] ' + status, data);
        return d.promise;
      });

    return d.promise;
  }
  return {
    get: PSDatas,
    syncGet: PSSyncDatas,
    add: PSDatasAdd,
    del: PSDatasDelete,
    update: PSDatasUpdate,
    PSExecute: PSExecute,
  };

});
