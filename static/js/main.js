// sketch for relations of karma

var BEERVIZ = BEERVIZ || {};

var relation;
var source_Id;
var target_Id;

BEERVIZ = (function () {

    var styleColors = ['fd78bd', 'a186be', '662d91', '5ea95c', 'ffdd00', '6dcff6', 'd74d94', '46142e', 'f26d7d', '5dbab9', '80bb42', 'cacec2', 'f1b867', '003663', 'f5989d', 'cd6f3c', '00a99d', '2e5a59', 'fff799', 'fbaf5d', '003663', '052a24', 'fff799', 'fbaf5d', '007236', 'aa71aa', 'bbbb42', '9ac2b9', '1d3b56', 'f26c4f', 'ee3224', 'fed42a', '82ca9c', 'aaa6ce', '455870', '0b6e5f', '00aeef', '448ccb', '7b0046', 'c4d9ec'];
    var colorSelector = 0;
    var colorIndex = [];
    var styleVal = 0;
    var userBeerType = 0;
    var attributeVal = [];
    var beerStyles = [];
    var userpref = 'good';


    /****************************************
     ** Module:: Global Initialization
     *****************************************/
    var init = function () {
        // console.log('basic page initializations');

        evtHandler();
        //initAttributeFilter();
        hideVizContext(); // hide all the the containers that are viz sensitive on document load
        loadData('DF1');

    };

    $("#list-credit").click(function () {
        $("#wrapper-credit").slideToggle("slow");
    });

    $(".close").click(function () {
        $("#wrapper-credit").slideToggle("slow");
    });

    function loadData(id) {

        var subPlotData;
        var code = id.slice(0, 2);
        // console.log(code);
        // Added to display the block only when user hovers
        if (code != 'DF') {
            $('#wrapper-details').css("display", "block");
            $('#wrapper-details').css("background", "rgba(190, 215, 53, 0.77)");
            $('#list-beersummary').css("display", "block");
        }

        switch (code) {

            case 'AR':
                path = 'data/aroma.json';
                break;
            case 'AP':
                path = 'data/appearance.json';
                break;
            case 'TA':
                path = 'data/taste.json';
                break;
            case 'OV':
                path = 'data/overall.json';
                break;
            default:
                path = 'data/overall.json';
        }

        jQuery.getJSON(path, function (data) {

            jQuery.each(data, function (key, val) {
                if (val.id == id) {
                    // console.log("hover values:", val);
                    $('#beersummary-name').html(val.name.split(".")[1]);
                    $('#beersummary-style').text('Style: ' + val.style);
                    $('#beersummary-ABV').text('ABV: ' + val.ABV);
                    $('#beersummary-rating').html('Average Rating of <span class=highlight>  ' + val.avg_rating + ' / 5</span> by <b>' + val.size + '</b> users');
                    $('#beersummary-rating').text(val.user);

                }

            });
        });
    }

    // hide the main deed visulization cart
    var hideVizContext = function () {
        jQuery('.context-viz').hide();
    };

    // remove the element that is active
    function resetClass(selector, c) {

        selector.parent().children().each(function () {

            if (jQuery(this).hasClass('active')) {
                jQuery(this).removeClass('active');
            }
        });

    }

    // interactions for choice the deeds style
    function evtHandler() {
        // console.log("event handler initialized");
        //jQuery('#editbox').dialog({'autoOpen': false});

        jQuery('#list-usePref li').click(function () {

            resetClass(jQuery(this), 'active');
            jQuery(this).addClass('active');
            // console.log("colorSelector: ",colorSelector);
            triggerViz(styleVal);

        });

    }

    // viz the svg and put sketch into html
    var triggerViz = function (styleVal) {

        // console.log('in triggerViz');
        d3Example(userBeerType, styleVal);

        jQuery('.context-viz').show();
        jQuery('#wrapper-viz').fadeIn(4000);
    };


    // input : colorVal userBeerType
    // styleVal : styleVal
    // and i ll change input into deedType
    // which is good/bad/sum.

    // depend on input to choice which data to render the viz
    var karma; // represent the deed.json
    // var relation; // represent the relation.json

    function strDiff(a, b) {
        var temp = {};
        var len_a = a.length,
            len_b = b.length;
        len_max = 5,
            len_min = len_a < len_b ? len_a : len_b;

        for (var i = 0; i < len_min; i++) {
            if (a[i] != b[i]) {
                return len_max - i;
            }
        }
        return len_max - len_min;
    }

    // console.log("in d3Example");
    // console.log("color Value:", colorVal, "style Value:", styleVal);
    var w = 1100,
        h = 1000,
        rx = w / 2 - 100,
        ry = h / 2 - 100,
        m0,
        rotate = 0;

    var splines = [],
        nodes,
        links,
        deeds;


    var cluster = d3.layout.cluster()
        .size([360, ry - 120])
        .sort(function (a, b) {
            return d3.ascending(a.id, b.id);
        })
        .separation(function (a, b) {
            var i = strDiff(a.id, b.id);
            //console.log(i);
            //i = Math.pow(2, i);
            i = Math.pow(2, i);
            return i;
        });



    var bundle = d3.layout.bundle();
    var line = d3.svg.line.radial()
        .interpolate("bundle")
        .tension(.85)
        .radius(function (d) {
            return d.y;
        })
        .angle(function (d) {
            return d.x / 180 * Math.PI;
        });


    var d3Example = function (colorVal, styleVal) {

        jQuery('#wrapper-viz').html('');

        var div = d3.select("#wrapper-viz");

        var svg = div.append("svg:svg")
            .attr("width", w)
            .attr("height", w)
            .append("svg:g")
            .attr("transform", "translate(" + rx + "," + (ry + 100) + ")");

        svg.append("svg:path")
            .attr("class", "arc")
            .attr("d", d3.svg.arc()
                .outerRadius(ry - 120)
                .innerRadius(0)
                .startAngle(0)
                .endAngle(2 * Math.PI)
        )
            .on("mousedown", mousedown);

        fileNode = 'data/karma.json' + "?" + Math.floor(Math.random() * 1000);
        fileLink = 'data/relation.json' + "?" + Math.floor(Math.random() * 1000);

        d3.json(fileNode, function (error, classes) {
            //console.log("-------------hello world----------------");
            d3.json(fileLink, function (error, relations) {

                //console.log(relations);

                karma = JSON.parse(JSON.stringify(classes));
                relation = JSON.parse(JSON.stringify(relations));

                render(karma, relation);


                function render(karma, relation) {

                    var classes = JSON.parse(JSON.stringify(karma));
                    var relations = JSON.parse(JSON.stringify(relation));

                    nodes = cluster.nodes(packages.root(classes));

                    console.log(nodes);
                    nodes.forEach(function (d){
                        if (d.id === "y-1-7"){
                            console.log(d.id + ": " + d.x);
                        }
                        if (d.id === "y-1-8"){
                            console.log(d.id + ": " + d.x);
                        }
                        if (d.id === "y-1-9"){
                            console.log(d.id + ": " + d.x);
                        }
                        if (d.id === "y-1-10"){
                            console.log(d.id + ": " + d.x);
                            //d.x = 70.54054054054052;
                            d.x = 235.94594594594594;
                        }

                        if (d.id === "y-3-7"){
                            console.log(d.id + ": " + d.x);
                        }
                         if (d.id === "y-3-8"){
                            console.log(d.id + ": " + d.x);
                        }
                        if (d.id === "y-3-9"){
                            console.log(d.id + ": " + d.x);
                        }
                        if (d.id === "y-3-10"){
                                //console.log(d.id + ": " + d.x);
                            console.log(d.id + ": " + d.x);
                            d.x = 325.94594594594594;
                            //d.x = 70.54054054054052;
                        }

                    });
                    // cluster 一出来就有问题了。
                    //console.log(nodes);
                    //var node_tmp123 = JSON.parse(JSON.stringify(nodes));
                    //console.log(nodes);

                    links = packages.imports(relations, nodes);
                    splines = bundle(links);

                    // change the position of nodes
                    var x_tmp = 0;
                    for (var i = 0; i < nodes.length; i++) {

                        //console.log(nodes[i].id +": " + nodes[i].x);

                        if (nodes[i].id === "x-2-3") {
                            x_tmp += nodes[i].x;
                            break;
                        } else if (nodes[i].id === "x-2-2") {
                            x_tmp += nodes[i].x;
                        }
                    }
                    x_tmp = x_tmp / 2;


                    // x has been changed here
                    //console.log()
                    nodes.forEach(function (d) {
                        //var d_x_tmp = d.x;
                        //console.log(d.id + ": " + d_x_tmp);
                        d.x = 270 + d.x - x_tmp;
                        if (d.x > 360) {
                            d.x = d.x - 360;
                        }
                    });

                    renderNodes(nodes);
                    renderLinks(links);
                }

                function renderNodes(nodes) {

                    /* ---------------------------------CIRCLE DRAGGING---------------------------------
                     BEGIN    */
                    var relatedNode = null;
                    var draggingNode = null;
                    var sourceNode = null;
                    var draggingNode_x = 0, draggingNode_y = 0;


                    var overRelatedNode = function (d) {
                        if (sourceNode != null && (d.id != sourceNode.id) && (d.id[0] != sourceNode.id[0])) {
                            console.log("in overRelatedNode");
                            relatedNode = d;

                            // expand the text font size of this test
                            label.select("#text" + d.id)
                                .attr("font-size", function (d, i) {
                                    textSize = 2.4;
                                    return textSize + 'em';
                                });
                        }
                        // relatedNode = d;
                    };

                    var outRelatedNode = function (d) {

                        if (relatedNode != null) {
                            label.select("#text" + relatedNode.id)
                                .attr("font-size", function (d, i) {
                                    textSize = 1.2;
                                    return textSize + 'em';
                                });

                            relatedNode = null;
                        }
                    };

                    var circleDragger = d3.behavior.drag()
                        .on("dragstart", function (d) {
                            console.log("drag-start");
                            sourceNode = d;
                            draggingNode = {x: 0, y: 0};

                            d3.select(this).attr('pointer-events', 'none');
                        })
                        .on("drag", function (d) {

                            var label_node = d3.select("#node-" + d.id);//.attr("__data__");
                            sourceNode = d3.select("#node-" + d.id).property("__data__");

                            // console.log(draggingNode);
                            draggingNode.x += d3.event.dx;
                            draggingNode.y += d3.event.dy;

                            d3.select(this)
                                .attr("pointer-events", "none");

                            // display lines from sourceNode to mouse
                            // link: sourceNode to draggingNode

                            var label_source = d3.select("#node-" + sourceNode.id);
                            label.selectAll(".tmpline")
                                .remove();
                            label_source.append("svg:line")
                                .attr("class", "sourcelink tmpline line")
                                .attr("pointer-events", "none")
                                .attr("x1", 0)
                                .attr("y1", 0)
                                .attr("x2", draggingNode.x)
                                .attr("y2", draggingNode.y);
                        })
                        .on("dragend", function (d) {

                            // put the movable circle back to its origin piont
                            d.point_x = 0;
                            d.point_y = 0;
                            var node = d3.select(this);
                            node.attr({cx: d.point_x, cy: d.point_y});

                            d3.select(this).attr("pointer-events", "");

                            draggingNode = {x: 0, y: 0};
                            // now restore the mouseover event or we won't be able to drag a 2nd time
                            d3.select(this).attr('pointer-events', '');
                            // return the node to the orign localte.

                            label.selectAll(".tmpline")
                                .remove();

                            if (sourceNode.id[0] == "x") {
                                source = sourceNode;
                                target = relatedNode;
                            } else {
                                source = relatedNode;
                                target = sourceNode;
                            }

                            if (relatedNode != null) {
                                label.select("#text" + relatedNode.id)
                                    .attr("font-size", function (d, i) {
                                        textSize = 1.2;
                                        return textSize + 'em';
                                    });

                                relatedNode = null;
                            }

                            sourceNode = null;
                            draggingNode = null;
                            relatedNode = null;

                            if (target != null) {
                                //
                                console.log("yes, message box");
                                relationEditbox(source, target);
                            }

                        });
                    /* ---------------------------------CIRCLE DRAGGING---------------------------------
                     END    */

                    // x 本来就有问题
                    //console.log(nodes);
                    var label = svg.selectAll("g.node")
                        .data(nodes.filter(function (n) {
                            //console.log("g.node - d: ");
                            // console.log(n);
                            return !n.children;
                            //return true;
                        }))
                        .enter()
                        .append("svg:g")
                        .attr("class", function (d) {
                            if (d.id[0] == "x") {
                                return "node input-x";
                            } else {
                                return "node output-y";
                            }
                        })
                        .attr("id", function (d) {
                            return "node-" + d.id;
                        })
                        .attr("transform", function (d) {
                            //
                            // return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                            // 错误原因： 是本来 x 的排布就有问题
                            //console.log(d.id+ " " + d.x + " " + d.y);

                            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                        });


                    label.append("circle")
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("fill", function (d, i) {
                            return '#' + styleColors[d.style_color - 1];
                        })
                        .attr("class", "karma_circle")
                        .attr("opacity", 1.0)
                        .attr("r", function (d, i) {
                            //return Math.round(Math.pow(d.size, 1/3));
                            return Math.round(Math.pow(250, 1 / 3));
                        })
                        .on("mouseover", overRelatedNode)
                        .on("mouseout", outRelatedNode)
                        .call(circleDragger);

                    label.append("svg:text")
                        .attr("id", function (d) {
                            return "text" + d.id;
                        })
                        .attr("dx", function (d) {
                            return d.x < 180 ? 30 : -30;
                        })
                        .attr("dy", "0.31em")
                        .attr("font-size", function (d, i) {
                            // console.log("font-size", d.size);

                            // var textSize = 1 + (d.size/1000);
                            textSize = 1.2;
                            return textSize + 'em';
                        })
                        .attr("fill", function (d, i) {

                            return '#' + styleColors[d.style_color - 1];
                        })
                        .attr("beerid", function (d, i) {
                            return d.id;
                        })
                        .attr("text-anchor", function (d) {
                            return d.x < 180 ? "start" : "end";
                        })
                        .attr("transform", function (d) {
                            return d.x < 180 ? null : "rotate(180)";
                        })
                        .text(function (d) {

                            var beerName = d.name;

                            if (beerName.length > 20) {
                                beerName = d.name.slice(0, 19);
                                beerName = beerName + '...';
                            }

                            return beerName;
                        })
                        .on("mouseover", function (d, i) {

                            // change the intro detail
                            // loadData(d.id);
                            mouseover(d, i);
                        })
                        .on("mouseout", mouseout)
                        .on("click", clickOnCircle)
                        .append("svg:title")
                        .text(function (d) {
                            return d.id;
                        });

                }

                function renderLinks(data) {

                    //console.log("in renderLinks");
                    //console.log(data);

                    svg.selectAll("path.link")
                        .remove();


                    var line = d3.svg.line.radial()
                        .interpolate("bundle")
                        .tension(.85)
                        .radius(function (d) {
                            return d.y;
                        })
                        .angle(function (d) {
                            // return d.x / 180 * Math.PI;
                            return d.x / 180 * Math.PI;
                        });


                    // enter
                    svg.selectAll("path.link")
                        .data(data)
                        .enter()
                        .append("svg:path")
                        .attr("class", function (d) {
                            return "link source-" + d.source.id + " target-" + d.target.id;
                        })
                        .attr("stroke", function (d, i) {
                            // console.log("style value", d.style_color, "line:", d.source.style_color);
                            return '#' + styleColors[d.source.style_color - 1];
                        })
                        .attr("d", function (d, i) {
                            return line(splines[i]);
                        });

                    // Update
                    svg.selectAll("path.link")
                        .data(data);
                    //console.log(svg.selectAll("path.link"));

                    // Delete
                    svg.selectAll("path.link")
                        .data(data)
                        .exit()
                        .remove();

                }


                function relationEditbox(sourceNode, targetNode) {

                    //console.log("in relationEditBox");

                    bootbox.dialog({

                        title: sourceNode.version.word + " -- " + targetNode.version.word,
                        message: '<div> 相关性： <input id="toggle-one" checked type="checkbox" targetId=' + targetNode.id + ' sourceId=' + sourceNode.id + '>' +
                        '<br />' +
                        '<br />' +
                        '<div id="relation_exp"></div>' +
                        '<br />' +
                        '<br />' +
                        '<div id="relation_demo"></div>' +
                        '<br />' +
                        '<br />' +
                        '<script src="js/toggle.js"></script>' +
                        '</div>',


                        buttons: {
                            save: {
                                label: "Save",
                                className: "btn-success",
                                callback: function () {

                                    //console.log("In relationEditBox Save ...");

                                    // var style = "add";
                                    if ($("#toggle-one").prop('checked')) {
                                        //console.log("in On");
                                        //console.log($("#relation_exp_value"));
                                        var relationNode = {
                                            input: sourceNode.id,
                                            output: targetNode.id,
                                            coefficient: parseInt($("#relation_exp_value").val()),
                                            case: $("#relation_case_value").val()
                                        };

                                        updateRelation(relationNode);
                                    } else {
                                        //console.log("in Off");
                                        deleteRelation(sourceNode.id, targetNode.id);
                                    }


                                    render(karma, relation);


                                    // ajax and send back to web-server.

                                    // send karma to backend servlet: set-karma
                                    var relation_json = JSON.stringify(relation);
                                    $.ajax({
                                        type: "POST",
                                        //type: "GET",
                                        url: "/set-relation",
                                        data: relation_json,
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        success: function (data) {
                                            //console.log("yes it's from set-karma response");
                                            alert(data);
                                        },
                                        failure: function (errMsg) {
                                            //console.log("no, it's error. but from set-karma response.");
                                            alert(errMsg);
                                        }
                                    })
                                        .success(function (data, testStatus, jqXHR) {
                                        });

                                }
                            },

                            cancel: {
                                label: "Cancel",
                                className: "btn-danger",
                                callback: function () {
                                    //console.log("do not save karma content");
                                }
                            }
                        }
                    });
                }


            });
        });


        // d3.select(window)
        //     .on("mousemove", mousemove)
        //     .on("mouseup", mouseup);

        function mouse(e) {
            return [e.pageX - rx, e.pageY - ry];
        }

        //console.log(map[""]);
        function mousedown() {
            m0 = mouse(d3.event);
            d3.event.preventDefault();
        }

        function mousemove() {

            if (m0) {

                var m1 = mouse(d3.event),
                    dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;
                div.style("-webkit-transform", "translate3d(0," + (ry - rx) + "px,0)rotate3d(0,0,0," + dm + "deg)translate3d(0," + (rx - ry) + "px,0)");
            }
        }


        function mouseup() {

            if (m0) {

                var m1 = mouse(d3.event),
                    dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;

                rotate += dm;
                if (rotate > 360)
                    rotate -= 360;
                else if
                (rotate < 0) rotate += 360;
                m0 = null;

                div.style("-webkit-transform", "rotate3d(0,0,0,0deg)");

                svg.attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
                    .selectAll("g.node text")
                    .attr("dx", function (d) {
                        return (d.x + rotate) % 360 < 180 ? 30 : -30;
                    })
                    .attr("text-anchor", function (d) {
                        return (d.x + rotate) % 360 < 180 ? "start" : "end";
                    })
                    .attr("transform", function (d) {
                        return (d.x + rotate) % 360 < 180 ? null : "rotate(180)";
                    });
            }
        }

        var pathOriginalColor = '';

        function mouseover(d) {

            // console.log("in mouseover");
            // jQuery('#wrapper-viz').addClass('chordhover');

            svg.selectAll("path.link.target-" + d.id)
                // .attr("stroke", "red")
                .classed("target", true)
                .each(updateNodes("source", true));

            svg.selectAll("path.link.source-" + d.id)
                .classed("source", true)
                .each(updateNodes("target", true));


            //the mouse on input node or output node
            if (d.id[0] === 'x') {

                infobox(d);

                links.forEach(function (dd) {

                    if (dd.source.id === d.id) {

                        infobox(dd.target);
                    }
                });

                // console.log(d);
                // add input-info and output-info
            } else {

                // console.log("output node");

                infobox(d);

                links.forEach(function (dd) {

                    if (dd.target.id === d.id) {

                        // add the  aside
                        nodes.forEach(function (ddd) {
                            if (ddd.id === dd.source.id) {

                                infobox(ddd);
                            }
                        });
                    }
                });
            }
        }

        function mouseout(d) {

            removeInfobox();

            //console.log("in mouseout");
            jQuery('#wrapper-viz').removeClass('chordhover');

            svg.selectAll("path.link.source-" + d.id)
                .classed("source", false)
                .each(updateNodes("target", false));

            svg.selectAll("path.link.target-" + d.id)
                .classed("target", false)
                .each(updateNodes("source", false));

            // remove input-info and out-put-info
            jQuery("#input-info").hide();

            jQuery("#output-info").hide();
        }

        function clickOnCircle(d) {
            popEditbox(d);
        }

        function updateNodes(name, value) {
            return function (d) {
                if (value) this.parentNode.appendChild(this);
                svg.select("#node-" + d[name].id)
                    .classed(name, value);
            };
        }


        function cross(a, b) {
            return a[0] * b[1] - a[1] * b[0];
        }

        function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1];
        }

        //console.log("end of d3.");
    };


    function renderDeedStyle(styles, colors) {

        var ele = jQuery('#deed-style .list-style');
        renderStyle(ele, styles, colors);
    }

    function renderKarmaStyle(styles, colors) {

        var ele = jQuery('#karma-style .list-style');
        renderStyle(ele, styles, colors);
    }

    function renderStyle(ele, styles, colors) {

        //console.log("bStyles: ",bStyles);
        ele.html('');
        if (styles && styles.length > -1) {

            for (var i = 0; i < styles.length; i++) {
                var tempInsertElement = '<li><span class="style-name">' + styles[i] + '</span><span class="style-color" style="background-color:#' + styleColors[colors[i] - 1] + '">&nbsp;</span></li>';
                ele.append(tempInsertElement);
            }
        }

    }

    // render deed types: there are two kinds of deeds: good, bad
    function renderBeerStyles(bStyles, bStylesColors) {

        var styleContainer = jQuery('#list-beerstyle');
        styleContainer.html('');

        var header = jQuery('#styleHead');
        header.html('');
        header.append("<h3>Deed and Karma<h3>");

        //console.log("bStyles: ",bStyles);
        if (bStyles && bStyles.length > -1) {

            for (var i = 0; i < bStyles.length; i++) {
                var tempInsertElement = '<li><span class="beerstyle-name">' + bStyles[i] + '</span><span class="beerstyle-color" style="background-color:#' + styleColors[bStylesColors[i] - 1] + '">&nbsp;</span></li>';
                styleContainer.append(tempInsertElement);
            }
        }
    }

    function infobox(d) {

        //console.log("-----------infobox------------");
        //console.log(d);

        var category = jQuery('#category');

        //console.log(d);
        var intro = d.version.intro;
        if (intro.length > 150) {
            intro = intro.slice(0, 150);
            intro = intro + '...';
        }


        var elements = '<aside class="infobox" id="infobox-' + d.id + '" ><div class="infobox-name"><h3>' + d.version.word + '</h3></div><ul class="infobox-keyword"></ul><div class="infobox-intro">' + intro + '</div></aside>';

        category.append(elements);
        //console.log(d.id);

        var node = jQuery('#node-' + d.id);
        //console.log(node.offset().top);

        var info = jQuery('#infobox-' + d.id);
        var left_right;

        var top_y;

        if (d.id[0] === 'x') {

            if (d.id[2] === '1') {
                top_y = 750;
            } else if (d.id[2] === '2') {
                top_y = 500;
            } else {
                top_y = 250;
            }

            //console.log("in x");
            info.css({
                'float': "left",
                'top': top_y,      //node.offset().top - 100,
                'left': 0
            });

        } else {

            if (d.id[2] === '1') {
                top_y = 250;
            } else if (d.id[2] === '2') {
                top_y = 500;
            } else {
                top_y = 750;
            }

            //console.log("in y");
            info.css({
                //'float': "right",
                'top': top_y, //node.offset().top - 100,
                'right': 0
            });
        }

        //infobox creat
    }

    function removeInfobox() {

        var info = jQuery('.infobox');
        info.remove();
    }

    function popEditbox(d) {
        // modify karma

        // console.log("popEditbox: pop a dialog to edit karma content");
        // console.log(d);
        bootbox.dialog({
            title: d.version.word,
            //message: "<form><input type='text' value="+d.version.intro+"></form>",
            // change massage into text
            // message: d.version.intro,
            message: '<textarea id="karma-content" rows="15" cols="97">' + d.version.intro + '</textarea>',

            buttons: {
                save: {
                    label: "Save",
                    className: "btn-success",
                    callback: function () {
                        // console.log("save karma content: ");
                        // console.log($('#karma-content').val());
                        // console.log("karma: ");
                        // console.log(karma);
                        // console.log("d: ");
                        // console.log(d);
                        // change karma object and post it to set-karma servlet.
                        // save the content into js.json and backend data model.
                        var karma_type = 0;
                        if (userpref == "bad") {
                            karma_type = 1;
                        }


                        for (k in karma) {
                            //console.log(k);
                            if (karma[k].id == d.id) {
                                karma[k].version[karma_type].intro = $('#karma-content').val();
                                break;
                            }
                        }
                        /*
                         for (var k in karma) {
                         // console.log(k);
                         if (karma[k].id == d.id) {
                         // care about the userpref = good/bad.
                         // console.log("yes find the karma id");
                         // console.log("karma_type:" + karma_type);
                         karma[k].version[karma_type].intro = $('#karma-content').val();
                         break;
                         }
                         }
                         */

                        // send karma to backend servlet: set-karma
                        var karma_json = JSON.stringify(karma);
                        $.ajax({
                            type: "POST",
                            //type: "GET",
                            url: "/set-karma",
                            data: karma_json,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {
                                //console.log("yes it's from set-karma response");
                                alert(data);
                            },
                            failure: function (errMsg) {
                                //console.log("no, it's error. but from set-karma response.");
                                alert(errMsg);
                            }
                        }).success(function (data, testStatus, jqXHR) {
                            //console.log("yes, ajax test ok....");
                        });

                        // change d
                        d.version.intro = $('#karma-content').val();
                        // console.log(d.version.intro);
                    }
                },

                cancel: {
                    label: "Cancel",
                    className: "btn-danger",
                    callback: function () {
                        console.log("do not save karma content");
                    }
                }
            }
        });
    }


    function updateRelation(relationNode) {
        console.log("relationNode: ");
        console.log(relationNode);
        var hasRelation = false;
        for (i in relation) {
            if ((relation[i].input == relationNode.input) && (relation[i].output == relationNode.output)) {
                relation[i].coefficient = relationNode.coefficient;
                relation[i].case = relationNode.case;
                hasRelation = true;
                break;
            }
        }
        if (hasRelation == false) {
            relation.push({
                input: relationNode.input,
                output: relationNode.output,
                coefficient: relationNode.coefficient,
                case: relationNode.case
            });
        }
    }

    function deleteRelation(sourceId, targetId) {
        for (i in relation) {
            if ((relation[i].input == sourceId) && (relation[i].output == targetId)) {
                relation.splice(i, 1);
            }
        }
    }

    return {
        'init': init,
        'colorSelector': colorSelector,
        'userBeerType': userBeerType,
        'beerStyles': beerStyles,
        'renderBeerStyles': renderBeerStyles,
        'renderDeedStyle': renderDeedStyle,
        'renderKarmaStyle': renderKarmaStyle
    };

})();


jQuery(document).ready(function () {

    BEERVIZ.init();
});
