'use strict';


myapp.controller('LoginController', function ($rootScope, $scope, AuthSharedService, $mdBottomSheet, USER_ROLES) {
    $scope.showBottomSheet = function () {
        $mdBottomSheet.show({
            templateUrl: 'partials/bottom-sheet.html',
            controller: 'ListBottomSheetCtrl'
        }).then(function (clickedItem) {
        });
    };

    $scope.rememberMe = true;
    $scope.login = function () {
        $rootScope.authenticationError = false;
        AuthSharedService.login(
            $scope.username,
            $scope.password,
            $scope.rememberMe
        );
    }
})
    .controller('HomeController', function ($scope, HomeService) {
        $scope.technos = HomeService.getTechno();
    })
    .controller('UsersController', function ($scope, $log, UsersService) {
        $scope.users = UsersService.getAll();
    })
    .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
        $scope.menu_items = [{
            name: 'Главная',
            href: '#/home',
            imageUrl: 'resources/img/icons/ic_home_white_24px.svg'
        }, {
            name: 'Принципиальная схема',
            href: '#/schemeView',
            imageUrl: 'resources/img/icons/ic_device_hub_white_24px.svg'
        }, {
            name: 'Пользователи',
            href: '#/users',
            imageUrl: 'resources/img/icons/ic_supervisor_account_white_24px.svg'
        }, {
            name: 'Документация API',
            href: '#/apiDoc',
            imageUrl: 'resources/img/icons/ic_description_white_24px.svg'
        }, {
            name: 'Сессии',
            href: '#/tokens',
            imageUrl: 'resources/img/icons/ic_transfer_within_a_station_white_24px.svg'
        }
        ];

        $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close();
        };

        $scope.go = function (item) {
            close();
            location.href = item.url;
        }
    })
    .controller('NavbarCtrl', function ($rootScope, $timeout, $mdSidenav, $scope, $location, $mdDialog, $http) {

        $rootScope.$on("$routeChangeSuccess", function () {
            $scope.showRightMenu = $location.path() === '/schemeEdit';
        });

        $scope.undo = function (event) {
            $rootScope.$emit('undo');
        };

        $scope.redo = function (event) {
            $rootScope.$emit('redo');
        };
        var dialog = function (title, message, ev) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Готово')
                    .targetEvent(ev)
            );
        };

        $scope.showAlert = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $rootScope.$emit('getDiagram');
            var diagram = JSON.parse($rootScope.diagram);
            dialog('Код схемы в формате JSON', $rootScope.diagram, ev);

        };


        $scope.saveScheme = function (ev) {
            $rootScope.$emit('getDiagram');
            var diagram = JSON.parse($rootScope.diagram);


            $http.post("/scheme/links", diagram.linkDataArray);

            $http.post("/scheme/nodes", diagram.nodeDataArray)
                .success(function (ev) {
                    $rootScope.$emit('diagramSaved');
                    var confirm = $mdDialog.confirm()
                        .title('Сохранение')
                        .textContent('Данные успешно сохранены! Продолжить редактирование или вернуться к просмотру схемы?')
                        .targetEvent(ev)
                        .ok('Продолжить')
                        .cancel('Вернуться к просмотру');
                    $mdDialog.show(confirm).then(function () {
                    }, function () {
                        $scope.exitEdit(ev);
                    });
                });

        }
        ;

        $scope.exitEdit = function (event) {
            $location.path('/schemeView');
        };
        var originatorEv;

        this.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.toggleLeft = buildToggler('left');
        $scope.isOpenRight = function () {
            return $mdSidenav('left').isOpen();
        };

        function buildToggler(navID) {
            return function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle();
            }
        }


    })
    .controller('GridBottomSheetCtrl', function ($scope, $mdBottomSheet, $rootScope) {
        $scope.items = [
            {name: "Кран", icon: "valve", category: "Valve"},
            {name: "Расходомер", icon: "flowmeter", category: "Flowmeter"},
            {name: "Прибор учета 1", icon: "meteringDevice-1", category: "MeteringDevice1"},
            {name: "Прибор учета 2", icon: "meteringDevice-2", category: "MeteringDevice2"},
            {name: "Насос", icon: "pump", category: "Pump"},
            {name: "Контроллер", icon: "controller", category: "Controller"}
        ];

        $scope.listItemClick = function ($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
            $rootScope.$emit('addItem', clickedItem.category);
        };
    })
    .controller('SchemeEditCtrl', function ($scope, $timeout, $mdBottomSheet, $mdToast, $rootScope) {

        $scope.showGridBottomSheet = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'partials/bottom-sheet-grid-template.html',
                controller: 'GridBottomSheetCtrl',
                clickOutsideToClose: true
            }).then(function (clickedItem) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Объект " + clickedItem['name'] + ' добавлен!')
                        .position('top right')
                        .hideDelay(1500)
                );
            });
        };

        var $ = go.GraphObject.make; // for more concise visual tree definitions
        var myDiagram =
            $(go.Diagram, "editDiagram", {
                "grid.visible": true,
                "grid.gridCellSize": new go.Size(30, 20),
                "draggingTool.isGridSnapEnabled": true,
                "resizingTool.isGridSnapEnabled": true,
                initialContentAlignment: go.Spot.Center,
                "linkingTool.isUnconnectedLinkValid": true,
                "rotatingTool.snapAngleMultiple": 90,
                "rotatingTool.snapAngleEpsilon": 45,
                "undoManager.isEnabled": true

            });
        // when the document is modified, add a "*" to the title and enable the "Save" button
        // myDiagram.addDiagramListener("Modified", function (e) {
        //     var button = document.getElementById("SaveButton");
        //     if (button) button.disabled = !myDiagram.isModified;
        //     var idx = document.title.indexOf("*");
        //     if (myDiagram.isModified) {
        //         if (idx < 0) document.title += "*";
        //     }
        //     else {
        //         if (idx >= 0) document.title = document.title.substr(0, idx);
        //     }
        // });


        function nodeStyle() {
            return [
                // The Node.location comes from the "loc" property of the node data,
                // converted by the Point.parse static method.
                // If the Node.location is changed, it updates the "loc" property of the node data,
                // converting back using the Point.stringify static method.
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                {
                    // the Node.location is at the center of each node
                    locationSpot: go.Spot.Center,
                    //isShadowed: true,
                    //shadowColor: "#888",
                    // handle mouse enter/leave events to show/hide the ports
                    mouseEnter: function (e, obj) {
                        showPorts(obj.part, true);
                    },
                    mouseLeave: function (e, obj) {
                        showPorts(obj.part, false);
                    }
                }
            ];
        }

        myDiagram.addDiagramListener("Modified", function(e) {
            var button = document.getElementById("SaveButton");
            if (button) button.disabled = !myDiagram.isModified;
            var idx = document.title.indexOf("*");
            if (myDiagram.isModified) {
                if (idx < 0) document.title += "*";
            }
            else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
            }
        });

        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
        // and where the port is positioned on the node, and the boolean "output" and "input" arguments
        // control whether the user can draw links from or to the port.
        function makePort(name, spot, output, input) {
            // the port is basically just a small circle that has a white stroke when it is made visible
            return $(go.Shape, "Circle",
                {
                    fill: "transparent",
                    stroke: null,  // this is changed to "white" in the showPorts function
                    desiredSize: new go.Size(8, 8),
                    alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                    cursor: "pointer"  // show a different cursor to indicate potential link point
                });
        }

        // define the Node templates for regular nodes

        var lightText = 'whitesmoke';

        myDiagram.nodeTemplateMap.add("Process",
            $(go.Node, "Auto", nodeStyle() ,
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "Cylinder1", {
                        name: "SHAPE",
                        strokeWidth: 2,
                        fill: $(go.Brush, "Linear", {
                            start: go.Spot.Left,
                            end: go.Spot.Right,
                            0: "#eeeeee",
                            0.5: "white",
                            1: "#eeeeee"
                        }),
                        minSize: new go.Size(50, 50),
                        portId: "",
                        fromSpot: go.Spot.AllSides,
                        toSpot: go.Spot.AllSides
                    },
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: false
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true));

        function changeColor(e, obj) {
            myDiagram.startTransaction("changed color");
            // get the context menu that holds the button that was clicked
            var contextmenu = obj.part;
            // get the node data to which the Node is data bound
            var nodedata = contextmenu.data;
            // compute the next color for the node
            var newcolor = "#e53935";
            switch (nodedata.color) {
                case "#00A9C9":
                    newcolor = "#e53935";
                    break;
                case "#e53935":
                    newcolor = "#00A9C9";
                    break;
            }
            // modify the node data
            // this evaluates data Bindings and records changes in the UndoManager
            myDiagram.model.setDataProperty(nodedata, "color", newcolor);
            myDiagram.commitTransaction("changed color");
        }

        myDiagram.nodeTemplateMap.add("Valve",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(56, 50),
                    source: "/resources/img/icons/scheme/valve.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));

        myDiagram.nodeTemplateMap.add("Flowmeter",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(56, 50),
                    source: "/resources/img/icons/scheme/flowmeter.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));

        myDiagram.nodeTemplateMap.add("MeteringDevice1",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(60, 30),
                    source: "/resources/img/icons/scheme/meteringDevice-1.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));

        myDiagram.nodeTemplateMap.add("MeteringDevice2",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(60, 30),
                    source: "/resources/img/icons/scheme/meteringDevice-2.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));


        myDiagram.nodeTemplateMap.add("Pump",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(50, 50),
                    source: "/resources/img/icons/scheme/pump.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));

        myDiagram.nodeTemplateMap.add("Controller",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 0,
                        editable: true
                    },
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(80, 40),
                    source: "/resources/img/icons/scheme/controller.svg"
                }),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: -27,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            ));

        myDiagram.nodeTemplateMap.add("",  // the default category
            $(go.Node, "Spot", nodeStyle(),
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle",
                        {fill: "#00A9C9", stroke: null},
                        new go.Binding("figure", "figure")),
                    $(go.TextBlock,
                        {
                            font: "bold 11pt Helvetica, Arial, sans-serif",
                            stroke: lightText,
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true
                        },
                        new go.Binding("text").makeTwoWay())
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, false, true),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, true, false)
            ));

        myDiagram.linkTemplate =
            $(go.Link, {
                    toShortLength: -2,
                    fromShortLength: -2,
                    layerName: "Background",
                    routing: go.Link.Orthogonal,
                    corner: 15,
                    fromSpot: go.Spot.RightSide,
                    toSpot: go.Spot.LeftSide,
                    curve: go.Link.JumpOver,
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: true,
                    resegmentable: true,
                    // mouse-overs subtly highlight links:
                },
                // make sure links come in from the proper direction and go out appropriately
                new go.Binding("fromSpot", "fromSpot", function (d) {
                    return spotConverter(d);
                }),
                new go.Binding("toSpot", "toSpot", function (d) {
                    return spotConverter(d);
                }),

                new go.Binding("points").makeTwoWay(),
                {
                    contextMenu:     // define a context menu for each node
                        $(go.Adornment, "Vertical",  // that has one button
                            $("ContextMenuButton",
                                $(go.TextBlock, "Изменить цвет"),
                                {click: changeColor})
                            // more ContextMenuButtons would go here
                        )  // end Adornment
                },
                // mark each Shape to get the link geometry with isPanelMain: true
                $(go.Shape, {
                        isPanelMain: true,
                        stroke: "#41BFEC" /* blue*/,
                        strokeWidth: 7
                    },
                    new go.Binding("stroke", "color")),
                $(go.Shape, {
                    isPanelMain: true,
                    stroke: "white",
                    strokeWidth: 3,
                    name: "PIPE",
                    strokeDashArray: [20, 40]
                })
            );

        for (var i = 0; i < $scope.nodes.length; i++) {
            var obj = $scope.nodes[i];
            if (obj.category == null) {
                delete(obj.category);
            }
            if (obj.angle == null) {
                delete (obj.angle);
            }
        }

        for (var i = 0; i < $scope.links.length; i++) {
            var obj = $scope.links[i];
            if (obj.color == null) {
                delete(obj.color);
            }
        }


        myDiagram.model = new go.GraphLinksModel($scope.nodes, $scope.links);
        // animate some flow through the pipes


// Устанавливает видимость портов при наведении мыши на шаблон
        function showPorts(node, show) {
            var diagram = node.diagram;
            if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
            node.ports.each(function (port) {
                port.stroke = (show ? "#41BFEC" : null);
            });
        }

        $rootScope.$on('getDiagram', function () {
            $rootScope.diagram = myDiagram.model.toJson();
        });

        $rootScope.$on('undo', function () {
            myDiagram.undoManager.undo();
        });

        $rootScope.$on('redo', function(){
            myDiagram.undoManager.redo();
        });

        $rootScope.$on('diagramSaved', function(){
            myDiagram.isModified = false;
        });

        $rootScope.$on('addItem', function(event, category){
            myDiagram.model.addNodeData({ category: category, text: "Текст" });
            console.log(category);
        });




    })
    .controller('SchemeViewCtrl', function ($scope) {


        var $ = go.GraphObject.make; // for more concise visual tree definitions
        var myDiagram =
            $(go.Diagram, "diagram", {
                isReadOnly: true,
                "grid.visible": true,
                "grid.gridCellSize": new go.Size(30, 20),
                "draggingTool.isGridSnapEnabled": true,
                "resizingTool.isGridSnapEnabled": true,
                initialContentAlignment: go.Spot.Center,
                "rotatingTool.snapAngleMultiple": 90
            });


        function nodeStyle() {
            return [];
        }

        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
        // and where the port is positioned on the node, and the boolean "output" and "input" arguments
        // control whether the user can draw links from or to the port.
        function makePort(name, spot, output, input) {
            // the port is basically just a small circle that has a white stroke when it is made visible
            return $(go.Shape, "Circle",
                {
                    fill: "transparent",
                    stroke: null,  // this is changed to "white" in the showPorts function
                    desiredSize: new go.Size(8, 8),
                    alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                    cursor: "pointer"  // show a different cursor to indicate potential link point
                });
        }

        // define the Node templates for regular nodes

        var lightText = 'whitesmoke';

        myDiagram.nodeTemplateMap.add("Process",
            $(go.Node, "Auto", {
                    locationSpot: new go.Spot(0.5, 0.5),
                    locationObjectName: "SHAPE",
                    resizable: false,
                    resizeObjectName: "SHAPE"
                },
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "Cylinder1", {
                        name: "SHAPE",
                        strokeWidth: 2,
                        fill: $(go.Brush, "Linear", {
                            start: go.Spot.Left,
                            end: go.Spot.Right,
                            0: "#eeeeee",
                            0.5: "white",
                            1: "#eeeeee"
                        }),
                        minSize: new go.Size(50, 50),
                        portId: "",
                        fromSpot: go.Spot.AllSides,
                        toSpot: go.Spot.AllSides
                    },
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: false
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true));
        myDiagram.nodeTemplateMap.add("Valve",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(56, 50),
                    source: "/resources/img/icons/scheme/valve.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));

        myDiagram.nodeTemplateMap.add("Flowmeter",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(56, 50),
                    source: "/resources/img/icons/scheme/flowmeter.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));

        myDiagram.nodeTemplateMap.add("MeteringDevice1",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(60, 30),
                    source: "/resources/img/icons/scheme/meteringDevice-1.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));

        myDiagram.nodeTemplateMap.add("MeteringDevice2",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(60, 30),
                    source: "/resources/img/icons/scheme/meteringDevice-2.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));


        myDiagram.nodeTemplateMap.add("Pump",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 5,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(50, 50),
                    source: "/resources/img/icons/scheme/pump.svg"
                }),
                makePort("L", go.Spot.Top, true, true),
                makePort("R", go.Spot.Bottom, true, true)
            ));

        myDiagram.nodeTemplateMap.add("Controller",
            $(go.Node, "Vertical", nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: 0,
                        editable: true
                    },
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),

                $(go.Picture, { desiredSize: new go.Size(80, 40),
                    source: "/resources/img/icons/scheme/controller.svg"
                }),
                $(go.TextBlock, {
                        alignment: go.Spot.Center,
                        textAlign: "center",
                        margin: -27,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            ));

        myDiagram.nodeTemplateMap.add("",  // the default category
            $(go.Node, "Spot", nodeStyle(),
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle",
                        {fill: "#00A9C9", stroke: null},
                        new go.Binding("figure", "figure")),
                    $(go.TextBlock,
                        {
                            font: "bold 11pt Helvetica, Arial, sans-serif",
                            stroke: lightText,
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true
                        },
                        new go.Binding("text").makeTwoWay())
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, false, true),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, true, false)
            ));


        myDiagram.linkTemplate =
            $(go.Link, {
                    toShortLength: -2,
                    fromShortLength: -2,
                    layerName: "Background",
                    routing: go.Link.Orthogonal,
                    corner: 15,
                    fromSpot: go.Spot.RightSide,
                    toSpot: go.Spot.LeftSide,
                    curve: go.Link.JumpOver
                    // mouse-overs subtly highlight links:
                },
                // make sure links come in from the proper direction and go out appropriately
                new go.Binding("fromSpot", "fromSpot", function (d) {
                    return spotConverter(d);
                }),
                new go.Binding("toSpot", "toSpot", function (d) {
                    return spotConverter(d);
                }),

                new go.Binding("points").makeTwoWay(),
                // mark each Shape to get the link geometry with isPanelMain: true
                $(go.Shape, {
                        isPanelMain: true,
                        stroke: "#41BFEC" /* blue*/,
                        strokeWidth: 7
                    },
                    new go.Binding("stroke", "color")),
                $(go.Shape, {
                    isPanelMain: true,
                    stroke: "white",
                    strokeWidth: 3,
                    name: "PIPE",
                    strokeDashArray: [20, 40]
                })
            );

        for (var i = 0; i < $scope.nodes.length; i++) {
            var obj = $scope.nodes[i];
            if (obj.category == null) {
                delete(obj.category);
            }
            if (obj.angle == null) {
                delete (obj.angle);
            }
        }

        for (var i = 0; i < $scope.links.length; i++) {
            var obj = $scope.links[i];
            if (obj.color == null) {
                delete(obj.color);
            }
        }


        myDiagram.model = new go.GraphLinksModel($scope.nodes, $scope.links);
        // animate some flow through the pipes
        loop(); // animate some flow through the pipes

        function loop() {
            var diagram = myDiagram;
            setTimeout(function () {
                var oldskips = diagram.skipsUndoManager;
                diagram.skipsUndoManager = true;
                diagram.links.each(function (link) {
                    var shape = link.findObject("PIPE");
                    var off = shape.strokeDashOffset - 2;
                    shape.strokeDashOffset = (off <= 0) ? 60 : off;
                });
                diagram.skipsUndoManager = oldskips;
                loop();
            }, 60);
        }

    })
    .controller('ApiDocController', function ($scope) {
        // init form
        $scope.isLoading = false;
        $scope.url = $scope.swaggerUrl = 'v2/api-docs';
        // error management
        $scope.myErrorHandler = function (data, status) {
            console.log('failed to load swagger: ' + status + '   ' + data);
        };

        $scope.infos = false;
    })
    .controller('TokensController', function ($scope, UsersService, TokensService, $q) {

        var browsers = ["Firefox", 'Chrome', 'Trident']

        $q.all([
            UsersService.getAll().$promise,
            TokensService.getAll().$promise
        ]).then(function (data) {
            var users = data[0];
            var tokens = data[1];

            tokens.forEach(function (token) {
                users.forEach(function (user) {
                    if (token.userLogin === user.login) {
                        token.firstName = user.firstName;
                        token.familyName = user.familyName;
                        browsers.forEach(function (browser) {
                            if (token.userAgent.indexOf(browser) > -1) {
                                token.browser = browser;
                            }
                        });
                    }
                });
            });

            $scope.tokens = tokens;
        });


    })
    .controller('LogoutController', function (AuthSharedService) {
        AuthSharedService.logout();
    })
    .controller('ErrorController', function ($scope, $routeParams) {
        $scope.code = $routeParams.code;

        switch ($scope.code) {
            case "403" :
                $scope.message = "Упс! Вы забыли авторизоваться."
                break;
            case "404" :
                $scope.message = "Страница на найдена."
                break;
            default:
                $scope.code = 500;
                $scope.message = "Упс! Неожиданная ошибка"
        }

    });