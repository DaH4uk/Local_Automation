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
    .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $mdDialog, SchemeService, $location, $window) {
        SchemeService.getAllSchemes().$promise.then(function (res) {
            $scope.schemes = res;
        });

        $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close();
        };

        $scope.go = function (item) {
            close();
            location.href = item.url;
        };

        $scope.addScheme = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('Введите имя новой схемы')
                .placeholder('Название схемы')
                .ariaLabel('Название схемы')
                .targetEvent(ev)
                .ok('Готово')
                .cancel('Отмена');

            $mdDialog.show(confirm).then(function (result) {
                SchemeService.addScheme(result).$promise.then(function (resId) {
                        $location.path("/schemeEdit/" + resId.schemeId);
                        $window.location.reload();
                    }
                );
                $scope.close();
            }, function () {
                $scope.close();
            });
        }
    })
    .controller('DataViewCtrl', function ($scope, $mdToast, DataService) {
        $scope.karatDataLoading = true;
        $scope.sauterDayloading = true;
        $scope.sauterNightLoading = true;
        $scope.sauterCoilLoading = true;

        $scope.sauterDayDisabled = false;
        $scope.sauterNightDisabled = false;
        $scope.coilDisabled = false;

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.toastPosition = angular.extend({}, last);

        $scope.getToastPosition = function () {
            sanitizePosition();

            return Object.keys($scope.toastPosition)
                .filter(function (pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

        function sanitizePosition() {
            var current = $scope.toastPosition;

            last = angular.extend({}, current);
        }


        var showToast = function (msg, delay) {
            var pinTo = $scope.getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent(msg)
                    .position(pinTo)
                    .hideDelay(delay * 1000)
            );
        };

        DataService.getKaratData().$promise.then(function (res) {
            if (res[0].indexOf('Error') + 1) {
                showToast("Не удалось загрузить значения регистров для Карат-307. Произошла ошибка: " + res[0], 15);
                $scope.KaratError = "Произошла ошибка при загрузке данных: " + res[0]
            } else {
                $scope.karatData = new Array();
                res.forEach(function (val) {
                    $scope.karatData.push(JSON.parse(val));
                });
                showToast("Значения регистров для Карат-307 успешно загружены!", 3);


            }
            $scope.karatDataLoading = false;
        });
        DataService.getSauterDayTemp().$promise.then(function (res) {
            if (res[0].indexOf('Error') + 1) {
                showToast("Не удалось загрузить значение дневной уставки для SAUTER EQJV125. Произошла ошибка: " + res[0], 15);
                $scope.sauterDayDisabled = true;
            } else {
                $scope.sauterDayTemp = res;
                showToast("Значение дневной уставки для SAUTER EQJV125 успешно загружено!", 3);

            }

            $scope.sauterDayloading = false;
        });
        DataService.getSauterNightTemp().$promise.then(function (res) {
            if (res[0].indexOf('Error') + 1) {
                showToast("Не удалось загрузить значение ночной уставки для SAUTER EQJV125. Произошла ошибка: " + res[0], 15);
                $scope.sauterNightDisabled = true;

            } else {
                $scope.sauterNightTemp = res;
                showToast("Значение ночной уставки для SAUTER EQJV125 успешно загружено!", 3);

            }
            $scope.sauterNightLoading = false;
        });
        DataService.getSauterCoilVal().$promise.then(function (res) {
            if (res[0].indexOf('Error') + 1) {
                showToast("Не удалось загрузить положение насоса для SAUTER EQJV125. Произошла ошибка: " + res[0], 15);
                $scope.coilDisabled = true;

            } else {
                $scope.sauterCoilVal = res[0];
                if (res[0] == true) {
                    $scope.sauterCoilVal = 1;
                } else {
                    $scope.sauterCoilVal = 0;
                }
                showToast("Положение насоса для SAUTER EQJV125 успешно загружено!", 3);
            }


            $scope.sauterCoilLoading = false;
        });

        $scope.sauterChange = function (s) {
            $scope.sauterCoilVal = s;
        };

        $scope.setSauterDayTemp = function () {
            $scope.sauterDayloading = true;
            DataService.setSauterDayVal($scope.sauterDayTemp[0]).$promise.then(function (res) {
                if (res.Errors == "Complete") {
                    showToast("Значение дневной уставки для SAUTER EQJV125 успешно установлено!", 3);
                } else {
                    showToast("Не удалось установить значение дневной уставки для SAUTER EQJV125. \n Поизошла ошибка: " + res.Errors, 15);
                }
                $scope.sauterDayloading = false;
            });
        };
        $scope.setSauterNightTemp = function () {
            var tmp =
                $scope.sauterNightLoading = true;
            DataService.setSauterNightVal($scope.sauterNightTemp[0]).$promise.then(function (res) {
                if (res.Errors == "Complete") {
                    showToast("Значение ночной уставки для SAUTER EQJV125 успешно установлено!", 3);
                } else {
                    showToast("Не удалось установить значение ночной уставки для SAUTER EQJV125. \n Поизошла ошибка: " + res.Errors, 15);
                }
                $scope.sauterNightLoading = false;
            });
        };
        $scope.setSauterCoil = function () {


            $scope.sauterCoilLoading = true;

            DataService.setSauterCoilVal($scope.sauterCoilVal).$promise.then(function (res) {
                if (res.Errors == "Complete") {
                    showToast("Положение насоса для SAUTER EQJV125 успешно установлено!", 3);
                } else {
                    showToast("Не удалось установить положение насоса для SAUTER EQJV125. Поизошла ошибка: " + res.Errors, 15);
                }
                $scope.sauterCoilLoading = false;
            });
        };

        $scope.setSauterControlVal = function () {
            DataService.setSauterControlVal($scope.controlVal).$promise.then(function (res) {
                if (res.Errors == "Complete") {
                    showToast("Положение трехпозиционного клапана для SAUTER EQJV125 успешно установлено!", 3);
                } else {
                    showToast("Не удалось установить положение трехпозиционного клапана для SAUTER EQJV125. Поизошла ошибка: " + res.Errors, 15);
                }

            });
        };


    })
    .controller('ImgUplDlgCtrl', function ($scope, $http, $mdDialog, $location, $rootScope) {
        $scope.upload = function () {
            var path = $location.path()+"";
            var schemeId = path.split("/");

            var formData = new FormData();

            angular.forEach($scope.files, function (obj) {
                if (!obj.isRemote) {
                    formData.append('file', obj.lfFile);
                }
            });

            var request = new XMLHttpRequest();
            request.open('POST', './scheme/upload?schemeId=' + schemeId[2]);
            request.send(formData);
            $rootScope.$emit("uploadImage");
            $scope.hide();


        };

        $scope.hide = function () {
            $mdDialog.hide();
        };
    })
    .controller('NavbarCtrl', function ($rootScope, $timeout, $mdSidenav, $scope, $location, $mdDialog, $http, SchemeService) {

        $rootScope.$on("$routeChangeSuccess", function () {
            var loc = $location.path() + "";
            $scope.showRightMenu = loc.indexOf("schemeEdit") === 1;
        });

        $scope.undo = function (event) {
            $rootScope.$emit('undo');
        };

        $scope.redo = function (event) {
            $rootScope.$emit('redo');
        };

        $scope.showUploadImageDialog = function (ev) {
            $mdDialog.show({
                controller: 'ImgUplDlgCtrl',
                templateUrl: 'partials/upload_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
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
            var loc = $location.path() + "";
            var schemeId = loc.substring(12);

            function showDialog(ev) {
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
            }

            SchemeService.saveNodes(schemeId, diagram.nodeDataArray).$promise.then(showDialog(ev));


        }
        ;

        $scope.exitEdit = function (event) {
            var loc = $location.path() + "";
            $location.path('/schemeView/' + loc.substring(12));
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
    .controller('DialogCtrl', function ($scope, $mdDialog, $rootScope, SchemeService, $mdBottomSheet) {
        $scope.items = [
            {name: "Кран", icon: "valve", category: "Valve", width: "24"},
            {name: "Расходомер", icon: "flowmeter", category: "Flowmeter", width: "24"},
            {name: "Прибор учета 1", icon: "meteringDevice-1", category: "MeteringDevice1", width: "44"},
            {name: "Прибор учета 2", icon: "meteringDevice-2", category: "MeteringDevice2", width: "44"},
            {name: "Насос", icon: "pump", category: "Pump", width: "24"},
            {name: "Контроллер", icon: "controller", category: "Controller", width: "44"}
        ];

        SchemeService.getImagesIds().$promise.then(function (res) {
            $scope.imageIds = res;
        });

        $scope.cancel = function () {
            $mdDialog.hide();
        };

        $scope.listItemClick = function ($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
            $rootScope.$emit('addItem', clickedItem.category);
        };
    })
    .controller('SchemeEditCtrl', function ($scope, $timeout, $mdDialog, $mdToast, $rootScope, SchemeService, $routeParams, $mdBottomSheet, $window) {
        var schemeId = $routeParams.id;

        $scope.isOpen = false;

        $scope.selectedMode = 'md-fling';

        $scope.selectedDirection = 'up';


        $scope.showTabDialog = function (ev) {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'partials/bottom-sheet-grid-template.html',
                controller: 'DialogCtrl',
                clickOutsideToClose: true
            }).then(function (clickedItem) {

                var itemName;
                if (clickedItem['name']) {
                    itemName = clickedItem['name'];
                } else {
                    itemName = 'изображение'
                }

            });
        };

        var $ = go.GraphObject.make; // for more concise visual tree definitions
        var myDiagram =
            $(go.Diagram, "editDiagram", {
                "draggingTool.isGridSnapEnabled": true,
                "resizingTool.isGridSnapEnabled": true,
                initialContentAlignment: go.Spot.Center,
                "linkingTool.isUnconnectedLinkValid": true,
                "rotatingTool.snapAngleMultiple": 90,
                "rotatingTool.snapAngleEpsilon": 45,
                "undoManager.isEnabled": true

            });


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

        myDiagram.addDiagramListener("Modified", function (e) {
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
                    desiredSize: new go.Size(7, 7),
                    alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                    cursor: "pointer"  // show a different cursor to indicate potential link point
                });
        }

        // define the Node templates for regular nodes

        var lightText = 'whitesmoke';

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
            $(go.Node, go.Panel.Spot, nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(56, 50),
                    source: "/resources/img/icons/scheme/valve.svg"
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 0.8)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", new go.Spot(-0.1, 0.25), true, true),
                makePort("R", new go.Spot(1.1, 0.25), true, true)
            ));

        myDiagram.nodeTemplateMap.add("Flowmeter",
            $(go.Node, go.Panel.Spot, nodeStyle(),  // or "Spot"
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(56, 50),
                    source: "/resources/img/icons/scheme/flowmeter.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 1.2)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            )
        );

        myDiagram.nodeTemplateMap.add("MeteringDevice1",
            $(go.Node, go.Panel.Spot, nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(60, 30),
                    source: "/resources/img/icons/scheme/meteringDevice-1.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 1.3)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            ));

        myDiagram.nodeTemplateMap.add("image",
            $(go.Part,
                $(go.Picture, "/scheme/getImgBySchemeId?schemeId=" + schemeId)
            ));


        myDiagram.nodeTemplateMap.add("MeteringDevice2",
            $(go.Node, go.Panel.Spot, nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(60, 30),
                    source: "/resources/img/icons/scheme/meteringDevice-2.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 1.3)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            ));
        myDiagram.nodeTemplateMap.add("Pump",
            $(go.Node, go.Panel.Spot,
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "Circle",
                    {fill: "#ACE600", stroke: null, desiredSize: new go.Size(50, 50)},
                    new go.Binding("fill", "color")),
                $(go.Picture, {
                    desiredSize: new go.Size(50, 50),
                    source: "/resources/img/icons/scheme/pump.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 1.3)
                    },
                    new go.Binding("text").makeTwoWay()
                )));

        myDiagram.nodeTemplateMap.add("Controller",
            $(go.Node, go.Panel.Spot, nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(80, 40),
                    source: "/resources/img/icons/scheme/controller.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 0.5)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            ));


        myDiagram.linkTemplate =
            $(go.Link, {
                    toShortLength: -2,
                    fromShortLength: -2,
                    layerName: "Background",
                    routing: go.Link.Orthogonal,
                    corner: 15,
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

        SchemeService.getLinks().$promise.then(function (links) {
            $scope.links = links;
            SchemeService.getNodes(schemeId).$promise.then(function (nodes) {
                $scope.nodes = nodes;

                for (var i = 0; i < $scope.nodes.length; i++) {
                    var obj = $scope.nodes[i];
                    if (obj.category == null) {
                        delete(obj.category);
                    }
                    if (obj.angle == null) {
                        delete (obj.angle);
                    }
                    if (obj.pos == null) {
                        delete (obj.pos);
                    }
                    if (obj.text == null) {
                        delete (obj.text);
                    }
                }

                for (var i = 0; i < $scope.links.length; i++) {
                    var obj = $scope.links[i];
                    if (obj.color == null) {
                        delete(obj.color);
                    }
                }
                myDiagram.model = new go.GraphLinksModel($scope.nodes, $scope.links);
                myDiagram.model.nodeDataArray.forEach(function (val) {
                    if (val.category === "image"){
                        $scope.isImage = true;
                    }
                });
                if (!$scope.isImage){
                    myDiagram.model.addNodeData({category: "image"});
                }

            });
        });
        // animate some flow through the pipes


// Устанавливает видимость портов при наведении мыши на шаблон
        function showPorts(node, show) {
            var diagram = node.diagram;
            if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
            node.ports.each(function (port) {
                port.stroke = (show ? "#3a3af9" : null);
                port.background = (show ? "#ffffff" : null);
            });
        }

        $rootScope.$on('getDiagram', function () {
            $rootScope.diagram = myDiagram.model.toJson();
        });

        $rootScope.$on('undo', function () {
            myDiagram.undoManager.undo();
        });

        $rootScope.$on('redo', function () {
            myDiagram.undoManager.redo();
        });

        $rootScope.$on('diagramSaved', function () {
            myDiagram.isModified = false;
        });

        $rootScope.$on('addItem', function (event, category) {
            myDiagram.model.addNodeData({category: category, text: "Текст"});
        });


        $rootScope.$on('uploadImage', function (event) {
            SchemeService.saveNodes(schemeId, myDiagram.model.nodeDataArray).$promise.then(
                $window.location.reload()
            );
        });



        $scope.zoomIn = function () {
            myDiagram.scale = myDiagram.scale + 0.1;

        };
        $scope.zoomOut = function () {
            myDiagram.scale = myDiagram.scale - 0.1;
        };

    })
    .controller('SchemeViewCtrl', function ($scope, SchemeService, DataService, $mdToast, $routeParams) {
        var schemeId = $routeParams.id;
        $scope.schemeId = $routeParams.id;

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.toastPosition = angular.extend({}, last);


        function sanitizePosition() {
            var current = $scope.toastPosition;

            last = angular.extend({}, current);
        }

        $scope.getToastPosition = function () {
            sanitizePosition();

            return Object.keys($scope.toastPosition)
                .filter(function (pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

        var $ = go.GraphObject.make; // for more concise visual tree definitions
        var myDiagram =
            $(go.Diagram, "diagram", {
                isReadOnly: true,
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

        myDiagram.nodeTemplateMap.add("Valve",
            $(go.Node, go.Panel.Spot, nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(56, 50),
                    source: "/resources/img/icons/scheme/valve.svg"
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 0.8)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", new go.Spot(-0.1, 0.25), true, true),
                makePort("R", new go.Spot(1.1, 0.25), true, true)
            ));


        myDiagram.nodeTemplateMap.add("Flowmeter",
            $(go.Node, go.Panel.Spot, nodeStyle(),  // or "Spot"
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(56, 50),
                    source: "/resources/img/icons/scheme/flowmeter.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 1.2)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            )
        );

        myDiagram.nodeTemplateMap.add("MeteringDevice1",
            $(go.Node, go.Panel.Spot, nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(60, 30),
                    source: "/resources/img/icons/scheme/meteringDevice-1.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 1.3)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            ));
        myDiagram.nodeTemplateMap.add("MeteringDevice2",
            $(go.Node, go.Panel.Spot, nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(60, 30),
                    source: "/resources/img/icons/scheme/meteringDevice-2.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 1.3)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            ));

        var changePumpColor = function (color) {
            var arr = myDiagram.model.nodeDataArray;

            for (var i = 0; i < arr.length; i++) {
                var data = arr[i];

                if (data.category == "Pump") {
                    data.color = color;
                    myDiagram.model.updateTargetBindings(data);
                }
            }
        };
        var changePumpState = function () {
            if ($scope.sauterCoilVal == 1) {
                DataService.setSauterCoilVal(0).$promise.then(function (res) {
                    changePumpColor("#dd0006");
                    $scope.sauterCoilVal = 0;
                    showToast("Насос выключен");
                });
            } else {
                DataService.setSauterCoilVal(1).$promise.then(function (res) {
                    changePumpColor("#15dd00");
                    $scope.sauterCoilVal = 1;

                    showToast("Насос включен");
                });
            }
        };
        myDiagram.nodeTemplateMap.add("Pump",
            $(go.Node, go.Panel.Spot,
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "Circle",
                    {fill: "#ffffff", stroke: null, desiredSize: new go.Size(50, 50)},
                    new go.Binding("fill", "color")),
                $(go.Picture, {
                    desiredSize: new go.Size(50, 50),
                    source: "/resources/img/icons/scheme/pump.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left,
                    click: function () {
                        changePumpState();
                    }
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 1.3)
                    },
                    new go.Binding("text").makeTwoWay()
                )));

        myDiagram.nodeTemplateMap.add("Controller",
            $(go.Node, go.Panel.Spot, nodeStyle(),
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(80, 40),
                    source: "/resources/img/icons/scheme/controller.svg",
                    alignment: new go.Spot(0.5, 0.5),
                    fromSpot: go.Spot.Right,  // port properties go on the port!
                    toSpot: go.Spot.Left
                }),
                $(go.TextBlock, {
                        textAlign: "center",
                        margin: 5,
                        editable: true,
                        alignment: new go.Spot(0.5, 0.5)
                    },
                    new go.Binding("text").makeTwoWay(),
                    // keep the text upright, even when the whole node has been rotated upside down
                    new go.Binding("angle", "angle", function (a) {
                        return a === 180 ? 180 : 0;
                    }).ofObject()),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true)
            ));


            myDiagram.nodeTemplateMap.add("image",
                $(go.Part,
                    $(go.Picture, "/scheme/getImgBySchemeId?schemeId=" + schemeId)
                ));


        myDiagram.linkTemplate =
            $(go.Link, {
                    toShortLength: -2,
                    fromShortLength: -2,
                    layerName: "Background",
                    routing: go.Link.Orthogonal,
                    corner: 15,
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

        SchemeService.getLinks().$promise.then(function (links) {
            $scope.links = links;
            SchemeService.getNodes(schemeId).$promise.then(function (nodes) {
                $scope.nodes = nodes;

                for (var i = 0; i < $scope.nodes.length; i++) {
                    var obj = $scope.nodes[i];
                    if (obj.category == null) {
                        delete(obj.category);
                    }
                    if (obj.angle == null) {
                        delete (obj.angle);
                    }
                    if (obj.pos == null) {
                        delete (obj.pos);
                    }
                    if (obj.text == null) {
                        delete (obj.text);
                    }
                }

                for (var i = 0; i < $scope.links.length; i++) {
                    var obj = $scope.links[i];
                    if (obj.color == null) {
                        delete(obj.color);
                    }
                }
                myDiagram.model = new go.GraphLinksModel($scope.nodes, $scope.links);
                myDiagram.model.nodeDataArray.forEach(function (val) {
                    if (val.category === "image"){
                        $scope.isImage = true;
                    }
                });
                if (!$scope.isImage){
                    myDiagram.model.addNodeData({category: "image"});
                }

            });
            getSauterCoilData();
        });


        var showToast = function (msg, delay) {
            var pinTo = $scope.getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent(msg)
                    .position(pinTo)
                    .hideDelay(delay * 1000)
            );
        };

        var getSauterCoilData = function () {
            DataService.getSauterCoilVal().$promise.then(function (res) {
                if (res[0].indexOf('Error') + 1) {
                    showToast("Не удалось загрузить положение насоса для SAUTER EQJV125. Произошла ошибка: " + res[0], 15);

                } else {
                    if (res[0] === 'true') {
                        changePumpColor("#15dd00");
                        $scope.sauterCoilVal = 1;
                    } else {
                        changePumpColor("#dd0006");
                        $scope.sauterCoilVal = 0;
                    }
                    showToast("Положение насоса для SAUTER EQJV125 успешно загружено!", 3);
                }


                $scope.sauterCoilLoading = false;
            });
        };

        $scope.zoomIn = function () {

            myDiagram.scale = myDiagram.scale + 0.1;


        };
        $scope.zoomOut = function () {

            myDiagram.scale = myDiagram.scale - 0.1;

        };


    })
    .controller('ApiDocController', function ($scope) {
        // init form
        $scope.isLoading = false;
        $scope.url = $scope.swaggerUrl = 'v2/api-docs';


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