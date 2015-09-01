(function () {

    packages = {

        // Lazily construct the package hierarchy from class names.
        // construct an tree for the input beers. and return the root.
        root: function (classes) {
            var map = {};

            var userpref = jQuery("#list-usePref li.active").attr('data-usePref');
            // console.log("userpref: " , userpref);
            //console.log("userBeerType in packages.js",userBeerType);

            // get beer syles to disply
            //store beer styles as input recommentdation.
            var filteredClasses = [];

            var deedStyles = [];
            var deedStylesColors = [];

            var deedStyle = [],
                deedColor = [],
                karmaStyle = [],
                karmaColor = [];

            for (var i = 0; i < classes.length; i++) {

                if (userpref == "good") {

                    // console.log("in good deed");
                    //displat good deed
                    //change sum deed into good deed.
                    var deed_tmp = classes[i];
                    deed_tmp.version = classes[i].good;
                    deed_tmp.name = classes[i].good.name;
                    console.log(deed_tmp);

                    //deed_tmp.version = classes[i].version[0];
                    //console.log(deed_tmp);
                    filteredClasses.push(deed_tmp);

                    var newStyle = classes[i].style;
                    if (deedStyles.indexOf(newStyle) === -1) {

                        deedStyles.push(newStyle);
                        deedStylesColors.push(classes[i].style_color);
                    }

                    //console.log(classes[i].id[-])
                    if (classes[i].id[0] === 'x') {

                        if (deedStyle.indexOf(newStyle) === -1) {

                            deedStyle.push(newStyle);
                            deedColor.push(classes[i].style_color);
                        }
                    } else {

                        if (karmaStyle.indexOf(newStyle) === -1) {

                            karmaStyle.push(newStyle);
                            karmaColor.push(classes[i].style_color);
                        }
                    }


                } else {

                    console.log("in bad deed");
                    //bad deed
                    var deed_tmp = classes[i];
                    //deed_tmp.version = classes[i].version[1];
                    deed_tmp.version = classes[i].bad;
                    deed_tmp.name = classes[i].bad.name;
                    //console.log(deed_tmp);
                    filteredClasses.push(deed_tmp);

                    var newStyle = classes[i].style;
                    if (deedStyles.indexOf(newStyle) === -1) {

                        deedStyles.push(newStyle);
                        deedStylesColors.push(classes[i].style_color);
                    }

                    if (classes[i].id[0] === 'x') {

                        if (deedStyle.indexOf(newStyle) === -1) {

                            deedStyle.push(newStyle);
                            deedColor.push(classes[i].style_color);
                        }
                    } else {

                        if (karmaStyle.indexOf(newStyle) === -1) {

                            karmaStyle.push(newStyle);
                            karmaColor.push(classes[i].style_color);
                        }
                    }

                }

            }

            // display the input beer style
            // to be change.
            //BEERVIZ.renderBeerStyles(deedStyles, deedStylesColors);
            BEERVIZ.renderDeedStyle(deedStyle, deedColor);
            BEERVIZ.renderKarmaStyle(karmaStyle, karmaColor);

            function find(id, data) {

                // name --> id
                var node = map[id],
                    i;

                if (!node) {

                    //if data is null, return {name, children}
                    node = map[id] = data || {id: id, children: []};

                    // console.log("node:", node);

                    if (id.length) {
                        i = id.lastIndexOf("-");
                        // console.log("i:", i);

                        // use the name to get an tree of the beer, in the beer name, the string before the . is the type of the style.
                        // in deedviz, we can use id, to form a tree of tree level.
                        node.parent = find(id.substring(0, i = id.lastIndexOf("-")));
                        // console.log("node parent:", node.parent);
                        // node.parent = ["shreyas"]
                        node.parent.children.push(node);
                        node.key = id.substring(i + 1);

                    }
                }
                return node;
            }

            filteredClasses.forEach(function (d) {
                find(d.id, d);
                //console.log(d);
                //var d_tmp12321 = JSON.parse(JSON.stringify(d));
                //console.log(d_tmp12321);
                //console.log(d.id + ": " + d.x);
            });


            // the "" is the root of the tree. because in find, it form a null '', as the parent of all others.
            // the root of beer types.
            //console.log("map : ");
            //console.log(map[""]);
            return map[""];
        },

        // Return a list of imports for the given array of nodes.
        // get the relations and points to each of nodes, and nodes is the beers.
        imports: function (relations, nodes) {

            //console.log("---------------------------");
            var map = {},
                imports = [];

            // Compute a map from name to node.
            nodes.forEach(function (d) {
                map[d.id] = d;
            });

            //console.log(map);
            // For each relation, construct a link from the input to output node.
            relations.forEach(function (d) {

                //console.log(d.input);
                //console.log(map[d.input]);
                imports.push({source: map[d.input], target: map[d.output]});
            });

            //console.log(imports);
            //console.log("---------------------------");
            return imports;
        }

    };
})();
