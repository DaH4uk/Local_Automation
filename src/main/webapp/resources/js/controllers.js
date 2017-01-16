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
    .controller('ListBottomSheetCtrl', function ($scope, $mdBottomSheet) {

    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
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
    .controller('NavbarCtrl', function ($rootScope, $timeout, $mdSidenav, $scope) {
    $rootScope.account = {
        id: 1,
        firstName: 'Данил',
        lastName: 'Туров',
        role: 'Администратор'
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
    .controller('GridBottomSheetCtrl', function ($scope) {

    })
    .controller('SchemeEditCtrl', function ($scope, $timeout, $mdBottomSheet, $mdToast) {


        var $ = go.GraphObject.make; // for more concise visual tree definitions
        var myDiagram =
            $(go.Diagram, "editDiagram", {
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


        function makePort(name, spot, output, input) {
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
            $(go.Node, "Vertical", {
                    locationSpot: new go.Spot(0.5, 1, 0, -21),
                    locationObjectName: "SHAPE",
                    selectionObjectName: "SHAPE",
                    rotatable: true
                },
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
                $(go.Shape, {
                    name: "SHAPE",
                    geometryString: "F1 M0 0 L40 20 40 0 0 20z M20 10 L20 30 M12 30 L28 30",
                    strokeWidth: 2,
                    fill: $(go.Brush, "Linear", {
                        0: "#eeeeee",
                        0.35: "white",
                        0.7: "#eeeeee"
                    }),
                    portId: "",
                    fromSpot: new go.Spot(1, 0.35),
                    toSpot: new go.Spot(0, 0.35)
                })
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
                )
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

        for (var i=0; i<$scope.nodes.length; i++){
            var obj = $scope.nodes[i];
            if (obj.category == null){
                delete(obj.category);
            }
            if (obj.angle == null){
                delete (obj.angle);
            }
        }

        for (var i=0; i<$scope.links.length; i++){
            var obj = $scope.links[i];
            if (obj.color == null){
                delete(obj.color);
            }
        }


        myDiagram.model = new go.GraphLinksModel($scope.nodes, $scope.links);
        // animate some flow through the pipes


        $scope.toggleRight = buildToggler('right');

        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            }
        }


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
            $(go.Node, "Vertical", {
                    locationSpot: new go.Spot(0.5, 1, 0, -21),
                    locationObjectName: "SHAPE",
                    selectionObjectName: "SHAPE",
                    rotatable: true
                },
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
                $(go.Shape, {
                    name: "SHAPE",
                    geometryString: "F1 M0 0 L40 20 40 0 0 20z M20 10 L20 30 M12 30 L28 30",
                    strokeWidth: 2,
                    fill: $(go.Brush, "Linear", {
                        0: "#eeeeee",
                        0.35: "white",
                        0.7: "#eeeeee"
                    }),
                    portId: "",
                    fromSpot: new go.Spot(1, 0.35),
                    toSpot: new go.Spot(0, 0.35)
                })
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
                )
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

        for (var i=0; i<$scope.nodes.length; i++){
            var obj = $scope.nodes[i];
            if (obj.category == null){
                delete(obj.category);
            }
            if (obj.angle == null){
                delete (obj.angle);
            }
        }

        for (var i=0; i<$scope.links.length; i++){
            var obj = $scope.links[i];
            if (obj.color == null){
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