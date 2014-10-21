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

var TimeZones = {};

(function() {

    var scm_tz, mls_tz, legend_shown = false;

    function displayTimeZones(div, ds, metric) {
        var data_tz, data, show_legend = false;
        if (ds === "scm") {
            data_tz = scm_tz;
        }
        else if (ds === "mls") {
            data_tz = mls_tz;
        }
        else {
            $("#"+div).html(ds + " not supported in time zones analysis.");
            return;
        }
        if (metric === undefined) {
            $.each(data_tz, function(key, values) {
                if (key != 'tz') {
                    metric = key;
                    return false;
                }
            });
        }
        labels = data_tz.tz;
        data = data_tz[metric];
        graph = "bars";
        title = "Time zones for " + metric;
        if (legend_shown === false) show_legend = true;
        config_metric = {legend : {container: "legend"}, show_legend: show_legend};
        if (show_legend) legend_shown = true;
        Viz.displayBasicChart(div, labels, data, graph, title, config_metric);
    }

    function loadTimeZonesData (cb) {
        var scm_json = "data/json/scm-timezone.json";
        var mls_json = "data/json/mls-timezone.json";
        $.when($.getJSON(scm_json),$.getJSON(mls_json)
            ).done(function(scm_data, mls_data) {
                scm_tz = scm_data[0];
                mls_tz = mls_data[0];
                cb();
        }).fail(function() {
            alert("Can't time zones data. Review: " +
                    scm_json + " " + mls_json);
        });
    }

    TimeZones.displayTimeZones = function() {
        var mark = "TimeZones";
        var divs = $("."+mark);
        if (divs.length > 0) {
            var unique = 0;
            $.each(divs, function(id, div) {
                div.id = mark + (unique++);
                var ds = $(this).data('data-source');
                if (ds === undefined) return;
                var metric = $(this).data('data-metric');
                displayTimeZones(div.id, ds, metric);
            });
        }
    };


    TimeZones.build = function() {
        loadTimeZonesData(TimeZones.displayTimeZones);
    };
})();

Loader.data_ready(function() {
    TimeZones.build();
});
