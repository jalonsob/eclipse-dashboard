/* 
 * Copyright (C) 2012-2014 Bitergia
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * This file is a part of the VizGrimoireJS package
 *
 * Authors:
 *   Alvaro del Castillo San Felix <acs@bitergia.com>
 *
 */

var Polarsys = {};

(function() {

    var sonar_json = "data/json/tools.cdt-sonar-prj-static.json";
    var grimoirelib_json = "data/json/tools.cdt-grimoirelib-prj-static.json";
    var pmi_json = "data/json/tools.cdt-pmi-prj-static.json";
    var sonar_metrics = null;
    var grimoirelib_metrics = null;
    var pmi_metrics = null;
    var metrics = {"process_metrics": {},
                   "product_metrics":{},
                   "community_metrics":{},
                   "usage_metrics":{}
                    };

    // Quick hack to show metrics with some design inside Bootstrap
    function displayMetric(name, description, value) {
        html = ' \
              <div class="well"> \
                <div class="row thin-border"> \
                  <div class="col-md-12">' + name + '</div> \
                </div> \
                <div class="row grey-border"> \
                  <div class="col-md-12 medium-fp-number">'+value+'</span> \
                  </div> \
                </div> \
               <div>'+description+'</div> \
              </div> \
        ';
        return html;
    }

    function displayPolarsysMetrics(div) {
        html = "";
        $.each(metrics, function(id, mgroup){
            if (mgroup === null) return;
            html += '<div class="col-md-3">';
            html += "<h2>"+id+"</h2>";
            $.each(mgroup, function(metric, value){
                html += displayMetric(metric,"",value);
            });
            html += '</div>';
        });
        $("#"+div).html(html);
        return;

        html = "";
        html += "<h2>SONAR Metrics</h2>";
        $.each(sonar_metrics, function(metric, value) {
            html += displayMetric(metric,"",value);
            // html += metric + ":" + value + " ";
        });
        html += "<br>";
        html += "<h2>SONAR Metrics</h2>";
        $.each(grimoirelib_metrics, function(metric, value) {
            html += metric + ":" + value + " ";
        });
        html += "<br>";
        $.each(pmi_metrics, function(metric, value) {
            html += metric + ":" + value + " ";
        });

        html += displayMetric("","","");
        $("#"+div).html(html);
    }

    function loadPolarsysMetrics (cb) {
        $.when($.getJSON(sonar_json),$.getJSON(grimoirelib_json),$.getJSON(pmi_json)
            ).done(function(sonar, grimoirelib, pmi) {
                sonar_metrics = sonar[0];
                grimoirelib_metrics = grimoirelib[0];
                pmi_metrics = pmi[0];
                // First approach
                metrics.product_metrics = sonar_metrics;
                metrics.process_metrics = grimoirelib_metrics;                
                cb();
        }).fail(function() {
            alert("Can't read Polarys JSON files. Review: " + 
                    sonar_json + " " + grimoirelib_json + " " + pmi_json);
        });
    }

    Polarsys.displayPolarsysMetrics = function() {
        var mark = "PolarsysMetrics";
        var divs = $("."+mark);
        if (divs.length > 0) {
            var unique = 0;
            $.each(divs, function(id, div) {
                div.id = mark + (unique++);
                displayPolarsysMetrics(div.id);
            });
        }
    };


    Polarsys.build = function() {
        loadPolarsysMetrics(Polarsys.displayPolarsysMetrics);
    };
})();

Loader.data_ready(function() {
    Polarsys.build();
});
