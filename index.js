$(document).ready(function(){
    $.ajax({"url":globalConstants.homeSite+'api/dataset_data?dataset=' + pageSettings.datasetID,
        "headers":{"Accept":"application/json"},
        success:function(response){
            if(response.data){
                var selects = {};
                $('#filters').find('.custom_select > select').each(function(){ selects[$(this).attr('id')] = []; });

                for (var i = 0; i < response.data.length; i++)
                    for (var j in selects) if(selects.hasOwnProperty(j))
                        selects[j].push(response.data[i][j]);

                for (var j in selects) if(selects.hasOwnProperty(j))
                    selects[j] = _.uniq(selects[j]).sort();

                for (var j in selects) if(selects.hasOwnProperty(j))
                    $('#'+j).html(_.map(selects[j], function(a){ return '<option>'+a+'</option>';}));

                buildFilterParamets();
            }
        }});
});

$('#filters select').change(buildFilterParamets);

var settings = {
    "tableau":{
        'url': pageSettings.tableauLink,
        'aliases':{"country":"Country","channel":"Channel","product_category":"Product Category"},
        'format': function(filter, aliases){
            if(filter.val())  return '&' + aliases[filter.attr('id')]+'=' + filter.val();
            return '';
        },
        'format_wrap': function(parameters){
            return parameters.join('');
        }
    },
    "qlik":{
        'url': pageSettings.qlikviewLink,
        'aliases':{"country":"country_lb","channel":"channel_lb","product_category":"category_lb"},
        'format': function(filter, aliases){
            if(filter.val())  return '&select='+aliases[filter.attr('id')]+',(' + filter.val().replace(" ", "?")+')';
            return '';
        },
        'format_wrap': function(parameters){
            return parameters.join('');
        }
    }
};

function buildFilterParamets(){
    for (var plugin_name in settings) {
        var plugin = settings[plugin_name];
        var filter_parameters =[];

        $('#filters select').each(function(){
            filter_parameters.push(plugin.format($(this),plugin.aliases));
        });

        filter_parameters = plugin.format_wrap(filter_parameters);
        console.log(filter_parameters);
        $('#'+plugin_name+'_iframe').attr('src',plugin.url+filter_parameters);
    }
};