'use strict';


var eclReadItems = [
    { name: "Sensor 1", icon: "ex", category: "sens", width: "24", path: "sensor_1", isLoading: false },
    { name: "Sensor 2", icon: "ex", category: "sens2", width: "24", path: "sensor_2", isLoading: false },
    { name: "Sensor 3", icon: "ex", category: "sens3", width: "24", path: "sensor_3", isLoading: false },
    { name: "Sensor 4", icon: "ex", category: "sens4", width: "24", path: "sensor_4", isLoading: false },
    { name: "Sensor 5", icon: "ex", category: "sens5", width: "24", path: "sensor_5", isLoading: false },
    { name: "Sensor 6", icon: "ex", category: "sens6", width: "24", path: "sensor_6", isLoading: false },
    { name: "Room temp 1", icon: "ex", category: "roomTemp1", width: "24", path: "room_temp_c1", isLoading: false },
    { name: "Room temp 2", icon: "ex", category: "roomTemp2", width: "24", path: "room_temp_c2", isLoading: false },
    { name: "Calc return temp 1", icon: "ex", category: "CalcReturnTemp1", width: "24", path: "calc_ret_temp_c1", isLoading: false },
    { name: "Calc return temp 2", icon: "ex", category: "CalcReturnTemp2", width: "24", path: "calc_ret_temp_c2", isLoading: false },
    { name: "Calc flow temp 1", icon: "ex", category: "CalcFlowTemp1", width: "24", path: "calc_flow_temp_c1", isLoading: false },
    { name: "Calc flow temp 2", icon: "ex", category: "CalcFlowTemp2", width: "24", path: "calc_flow_temp_c2", isLoading: false },
    { name: "Outdoor temperature", icon: "ex", category: "OutdoorTemp", width: "24", path: "outdoor_temp", isLoading: false }
];

var eclWriteItems = [
    { name: "Параллельное смещение", icon: "ex", category: "parallel_displacement_c1", width: "24", path: "parallel_displacement_c1", isLoading: false, min: -9, max: 9 },
    { name: "Минимальная температура потока", icon: "ex", category: "flow_temp_min_c1", width: "24", path: "flow_temp_min_c1", isLoading: false, min: 10, max: 110 },
    { name: "Максимальная температура потока", icon: "ex", category: "flow_temp_max_c1", width: "24", path: "flow_temp_max_c1", isLoading: false, min: 10, max: 110 },
    { name: "Дневная температура горячей воды", icon: "ex", category: "hw_temp_day_sp", width: "24", path: "hw_temp_day_sp", isLoading: false, min: 10, max: 110 },
    { name: "Ночная температура горячей воды", icon: "ex", category: "hw_temp_night_sp", width: "24", path: "hw_temp_night_sp", isLoading: false, min: 10, max: 110 }
];

myapp.controller('LoginController', function ($rootScope, $scope, AuthSharedService, $mdBottomSheet) {
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
    .controller('DataViewCtrl', function ($scope, $mdToast, ngstomp, $log) {
        $scope.sauterDayloading = true;
        $scope.sauterNightLoading = true;
        $scope.sauterCoilLoading = true;
        $scope.sauterControlLoading = true;

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


        ngstomp
            .subscribeTo('/data/updater')
            .callback(whatToDoWhenMessageComming)
            .withBodyInJson()
            .connect();

        ngstomp.send("/app/hello", "hello");


        function whatToDoWhenMessageComming(message) {
            var wsData = message.body;
            $log.info(wsData);
            parseData(wsData);
        }

        var parseData = function (data) {
            // if (data.errorsMap.karat_data) {
            //     $scope.KaratError = "Произошла ошибка при загрузке данных: " + data.errorsMap.karat_data;
            // } else {
            //     $scope.karatData = data.karatData;
            // }
            if (data.Error === "" || data.Error === undefined) {
                $scope.sauterDayloading = false;
                $scope.sauterNightLoading = false;
                $scope.sauterCoilLoading = false;
                $scope.sauterControlLoading = false;
            } else {
                $scope.sauterDayloading = false;
                $scope.sauterNightLoading = false;
                $scope.sauterCoilLoading = false;
                $scope.sauterControlLoading = false;
                showToast("Произошла ошибка: " + data.Error);
            }

            if (data.Daysetpoint) {
                $scope.sauterDayTemp = data.Daysetpoint;
                $scope.sauterDayloading = false;
            }

            if (data.Nightsetpoint) {
                $scope.sauterNightTemp = data.Nightsetpoint;
                $scope.sauterNightLoading = false;
            }
            if (data.bitTerminal6) {
                if (data.bitTerminal6 === "true") {
                    $scope.sauterCoilVal = 1;
                } else {
                    $scope.sauterCoilVal = 0;
                }
                $scope.sauterCoilLoading = false;
            }
            if (data.ControlSignalRK1) {
                $scope.controlVal = data.ControlSignalRK1;
                $scope.sauterControlLoading = false;
            }


            $scope.ATHeatOffRK1 = data.ATHeatOffRK1;
            $scope.ControlSignalRK1 = data.ControlSignalRK1;
            $scope.CyclicalinitModem = data.CyclicalinitModem;
            $scope.Date = data.Date;
            $scope.DeviceStatus = data.DeviceStatus;
            $scope.DeviceStatusArchive = data.DeviceStatusArchive;
            $scope.DialPauseModem = data.DialPauseModem;
            $scope.DialRepeatModem = data.DialRepeatModem;
            $scope.Errorcounter = data.Errorcounter;
            $scope.Firmwareversion = data.Firmwareversion;
            $scope.Flowsetpoint = data.Flowsetpoint;
            $scope.Hardwareversion = data.Hardwareversion;
            $scope.FlowtempVF1 = data.FlowtempVF1;
            $scope.Maxflowtemp = data.Maxflowtemp;
            $scope.Minflowtemp = data.Minflowtemp;
            $scope.ModeRK1 = data.ModeRK1;
            $scope.OutdoortempAF1 = data.OutdoortempAF1;
            $scope.Productnumber = data.Productnumber;
            $scope.Proportionalband = data.Proportionalband;
            $scope.Resettime = data.Resettime;
            $scope.RoomtempRF1 = data.RoomtempRF1;
            $scope.Runtimeforactuator = data.Runtimeforactuator;
            $scope.Slopeofheating = data.Slopeofheating;
            $scope.Switchposition = data.Switchposition;
            $scope.Time = data.Time;
            $scope.TimeoutModem = data.TimeoutModem;
            $scope.WriteenableModem = data.WriteenableModem;
            $scope.Year = data.Year;
            $scope.bitCollective = data.bitCollective;
            $scope.bitControlelement = data.bitControlelement;
            $scope.bitDialiferror = data.bitDialiferror;
            $scope.bitDisablemodem = data.bitDisablemodem;
            $scope.bitHeatingmediumpump = data.bitHeatingmediumpump;
            $scope.bitManualmode = data.bitManualmode;
            $scope.bitOperatingmode = data.bitOperatingmode;
            $scope.bitSetpointvalueTf = data.bitSetpointvalueTf;
            $scope.bitTimeout = data.bitTimeout;
            $scope.system = data.system;

            if (data.register) {
                if (data.register === "1") {
                    $scope.readMode1 = data.value;
                    $scope.isLoadingreadMode1 = false;

                } else if (data.register === "2") {
                    $scope.readMode2 = data.value;
                    $scope.isLoadingreadMode2 = false;

                } else if (data.register === "3") {
                    $scope.readMode3 = data.value;
                    $scope.isLoadingreadMode3 = false;

                }
                if (!data.value || data.value === "true") {
                    if (data.value !== "true")
                        showToast(data.error, 3);
                    $scope.eclReadItems.forEach(function (item) {
                        if (item.path === data.register) {
                            item.isLoading = false;
                        }
                    });
                    $scope.eclWriteRegisters.forEach(function (item) {
                        if (item.path === data.register) {
                            item.isLoading = false;
                        }
                    })
                } else {
                    $scope.eclReadItems.forEach(function (item) {
                        if (item.path === data.register) {
                            item.isLoading = false;
                            item.value = data.value;
                        }
                    });
                    $scope.eclWriteRegisters.forEach(function (item) {
                        if (item.path === data.register) {
                            item.isLoading = false;
                            item.value = data.value;
                        }
                    })
                }
            }

            if (data.app_type) {
                $scope.appType = data.app_type;
                $scope.isAppTypeLoading = false;
            }
        };


        $scope.setSauterDayTemp = function () {
            $scope.sauterDayloading = true;
            ngstomp.send("/app/set", {
                element: "day_setpoint_rk1",
                value: $scope.sauterDayTemp
            });
        };
        $scope.setSauterNightTemp = function () {
            $scope.sauterNightLoading = true;
            ngstomp.send("/app/set", {
                element: "night_setpoint_rk1",
                value: $scope.sauterNightTemp
            });
        };
        $scope.setSauterCoil = function () {
            $scope.sauterCoilLoading = true;
            ngstomp.send("/app/set", {
                element: "write_coil_57",
                value: $scope.sauterCoilVal
            });
        };

        $scope.setSauterControlVal = function () {
            $log.info($scope.controlVal);
            $scope.sauterControlLoading = true;
            ngstomp.send("/app/set", {
                element: "control_rk1",
                value: $scope.controlVal
            });
        };

        $scope.$on('$routeChangeStart', function (next, current) {
            ngstomp.unsubscribe("/data/updater");
        });

        $scope.eclReadItems = eclReadItems;


        $scope.eclWriteRegisters = eclReadItems;


        $scope.getEclRam = function (item) {
            var path = item.path;
            item.isLoading = true;
            ngstomp
                .send('/app/ECL300', "read_ram " + path);
        };
        $scope.getEclEerom = function (item) {
            var path = item.path;
            item.isLoading = true;
            ngstomp
                .send('/app/ECL300', "read_eeprom " + path);
        };

        $scope.getEclReadMode = function (val) {
            if (val === 1) {
                $scope.isLoadingreadMode1 = true;
            }
            if (val === 2) {
                $scope.isLoadingreadMode2 = true;
            }
            if (val === 3) {
                $scope.isLoadingreadMode3 = true;
            }

            ngstomp
                .send('/app/ECL300', "read_mode " + val);
        };

        $scope.getEclAppType = function () {
            $scope.isAppTypeLoading = true;
            ngstomp
                .send('/app/ECL300', "read_app_type");
        };

        $scope.setEclVal = function (item) {
            item.isLoading = true;
            ngstomp.send("/app/ECL300", "write " + item.path + " " + item.value);

            console.log(item);
        }
    })
    .controller('ImgUplDlgCtrl', function ($scope, $http, $mdDialog, $location, $rootScope) {
        $scope.upload = function () {
            var path = $location.path() + "";
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
    .controller('NavbarCtrl', function ($rootScope, $timeout, $mdSidenav, $scope, $location, $mdDialog, $http, SchemeService, ngstomp, $log) {

        $rootScope.$on("$routeChangeSuccess", function () {
            var loc = $location.path() + "";
            $scope.showRightMenu = loc.indexOf("schemeEdit") === 1;
        });

        ngstomp
            .subscribeTo('/data/errors')
            .callback(whatToDoWhenMessageComing)
            .withBodyInJson()
            .connect();
        $scope.errorData = [];
        $scope.showErrorData = false;
        function whatToDoWhenMessageComing(message) {
            var wsData = message.body;
            $scope.showErrorData = true;
            $scope.errorData.push(wsData);
            var audio = new Audio('/resources/FadeIn.mp3');
            audio.play();
            $scope.errorSize = $scope.errorData.length;
            $log.info($scope.errorData);
        }

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
            // {name: "Кран", icon: "valve.svg", category: "Valve", width: "24"},
            // {name: "Расходомер", icon: "flowmeter.svg", category: "Flowmeter", width: "24"},
            // {name: "Прибор учета 1", icon: "meteringDevice-1.svg", category: "MeteringDevice1", width: "44"},
            // {name: "Прибор учета 2", icon: "meteringDevice-2.svg", category: "MeteringDevice2", width: "44"},
            {name: "Насос", icon: "pump.svg", category: "Pump", width: "24"},
            // {name: "Контроллер", icon: "controller.svg", category: "Controller", width: "44"},
            {name: "Дневная тепература", icon: "tempCtrl.png", category: "dayTemp", width: "24"},
            {name: "Ночная тепература", icon: "tempCtrl.png", category: "nightTemp", width: "24"},
            {name: "Трехпозиционный клапан", icon: "threeWayValve.svg", category: "threeWayValve", width: "24"}
        ];

        $scope.EclItems = eclReadItems;

        $scope.EclWriteItems = eclWriteItems;


        SchemeService.getImagesIds().$promise.then(function (res) {
            $scope.imageIds = res;
        });
        $scope.cancel = function () {
            $mdDialog.hide();
        };

        $scope.listItemClick = function ($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
            $rootScope.$emit('addItem', clickedItem.category, clickedItem.name, true);
        };
        $scope.createEclItems = function ($index) {
            var clickedItem = $scope.EclItems[$index];
            $mdBottomSheet.hide(clickedItem);
            $rootScope.$emit('addItem', clickedItem.category, clickedItem.name, false);
        };
        $scope.createEclWriteItems = function ($index) {
            var clickedItem = $scope.EclWriteItems[$index];
            $mdBottomSheet.hide(clickedItem);
            $rootScope.$emit('addItem', clickedItem.category, clickedItem.name, false);
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

        // myDiagram.addLayerBefore($(go.Layer, { name: "Foreground" }), myDiagram.findLayer("Foreground"));

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
                $(go.Picture, "/scheme/getImgBySchemeId?schemeId=" + schemeId),
                new go.Binding("layerName", "layer")
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
                new go.Binding("layerName", "layer"),
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

        myDiagram.nodeTemplateMap.add("threeWayValve",
            $(go.Node, go.Panel.Spot,
                {
                    locationSpot: new go.Spot(0.5, 1, 0, -21), locationObjectName: "SHAPE",
                    selectionObjectName: "SHAPE", rotatable: true
                },
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("layerName", "layer"),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(50, 50),
                    source: "/resources/img/icons/scheme/threeWayValve.svg",
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
                    }).ofObject()
                )));


        myDiagram.nodeTemplateMap.add("dayTemp",
            $(go.Node, go.Panel.Position,
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("layerName", "layer"),
                $(go.Shape, "Rectangle",
                    {
                        name: "TABLESHAPE",
                        position: new go.Point(0, 0),
                        desiredSize: new go.Size(200, 100),
                        fill: "#ffbe00", stroke: null
                    }),
                $(go.TextBlock, {
                    editable: true,
                    font: "bold 11pt Verdana, sans-serif",
                    position: new go.Point(0, 0),
                    text: "Дневная температура"
                }),
                $(go.Panel, "Auto",
                    {
                        column: 1,
                        position: new go.Point(20, 30)
                    },
                    $(go.Shape, {fill: "#F2F2F2"}),
                    $(go.TextBlock,
                        {
                            font: "10pt Verdana, sans-serif",
                            textAlign: "right", margin: 2,
                            width: 50,
                            isMultiline: false,
                            text: "-",
                            textValidation: isValidCount
                        },
                        new go.Binding("text").makeTwoWay(function (count) {
                            return parseInt(count, 10);
                        })
                    )
                ),
                $(go.Panel, "Horizontal",
                    {
                        column: 2,
                        position: new go.Point(80, 30)
                    },
                    $("Button",
                        {
                            click: incrementCount
                        },
                        $(go.Shape, "PlusLine", {margin: 3, desiredSize: new go.Size(7, 7)})
                    ),
                    $("Button",
                        {
                            click: decrementCount
                        },
                        $(go.Shape, "MinusLine", {margin: 3, desiredSize: new go.Size(7, 7)})
                    )
                )));


        var createDiagramItem = function (name, category) {
            myDiagram.nodeTemplateMap.add(category,
                $(go.Node, go.Panel.Position,
                    new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                    new go.Binding("layerName", "layer"),
                    $(go.Shape, "Rectangle",
                        {
                            name: "TABLESHAPE",
                            position: new go.Point(0, 0),
                            desiredSize: new go.Size(250, 80),
                            fill: "#ffbe00", stroke: null
                        }),
                    $(go.TextBlock, {
                        editable: true,
                        font: "bold 11pt Verdana, sans-serif",
                        position: new go.Point(0, 0),
                        text: name
                    }),
                    $(go.Panel, "Auto",
                        {
                            column: 1,
                            position: new go.Point(20, 30)
                        },
                        $(go.TextBlock,
                            {
                                font: "10pt Verdana, sans-serif",
                                width: 50,
                                text: "-"

                            },
                            new go.Binding("text").makeTwoWay(function (count) {
                                return parseInt(count, 10);
                            })
                        )
                    ),
                    $(go.Panel, "Horizontal",
                        {
                            column: 2,
                            position: new go.Point(80, 30)
                        },
                        $("Button",
                            $(go.TextBlock, "Обновить", {margin: 3, desiredSize: new go.Size(70, 14)})
                        )
                    )));
        };

        eclReadItems.forEach(function (item) {
            createDiagramItem(item.name, item.category);
        });
        eclWriteItems.forEach(function (item) {
            createDiagramItem(item.name, item.category);
        });

        myDiagram.nodeTemplateMap.add("nightTemp",
            $(go.Node, go.Panel.Position,
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("layerName", "layer"),
                $(go.Shape, "Rectangle",
                    {
                        name: "TABLESHAPE",
                        position: new go.Point(0, 0),
                        desiredSize: new go.Size(200, 100),
                        fill: "#008dff", stroke: null
                    }),
                $(go.TextBlock, {
                    editable: true,
                    font: "bold 11pt Verdana, sans-serif",
                    position: new go.Point(0, 0),
                    text: "Ночная температура"
                }),
                $(go.Panel, "Auto",
                    {
                        column: 1,
                        position: new go.Point(20, 30)
                    },
                    $(go.Shape, {fill: "#F2F2F2"}),
                    $(go.TextBlock,
                        {
                            font: "10pt Verdana, sans-serif",
                            textAlign: "right", margin: 2,
                            width: 50,
                            isMultiline: false,
                            text: "-",
                            textValidation: isValidCount
                        },
                        new go.Binding("text").makeTwoWay(function (count) {
                            return parseInt(count, 10);
                        })
                    )
                ),
                $(go.Panel, "Horizontal",
                    {
                        column: 2,
                        position: new go.Point(80, 30)
                    },
                    $("Button",
                        {
                            click: incrementCount
                        },
                        $(go.Shape, "PlusLine", {margin: 3, desiredSize: new go.Size(7, 7)})
                    ),
                    $("Button",
                        {
                            click: decrementCount
                        },
                        $(go.Shape, "MinusLine", {margin: 3, desiredSize: new go.Size(7, 7)})
                    )
                )));

        // Validation function for editing text
        function isValidCount(textblock, oldstr, newstr) {
            if (newstr === "") return false;
            var num = +newstr; // quick way to convert a string to a number
            return !isNaN(num) && Number.isInteger(num) && num >= 0;
        }

        // When user hits + button, increment count on that option
        function incrementCount(e, obj) {
            myDiagram.model.startTransaction("increment count");
            var slicedata = obj.panel.panel.data;
            myDiagram.model.setDataProperty(slicedata, "text", slicedata.count + 1);
            myDiagram.model.commitTransaction("increment count");
        }

        // When user hits - button, decrement count on that option
        function decrementCount(e, obj) {
            myDiagram.model.startTransaction("decrement count");
            var slicedata = obj.panel.panel.data;
            if (slicedata.count > 0)
                myDiagram.model.setDataProperty(slicedata, "text", slicedata.count - 1);
            myDiagram.model.commitTransaction("decrement count");
        }

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
                $scope.nodes.forEach(function (val) {
                    if (val.category !== "image") {
                        val.layer = "Foreground";
                    }
                });
                myDiagram.model = new go.GraphLinksModel($scope.nodes, $scope.links);
                myDiagram.model.nodeDataArray.forEach(function (val) {
                    if (val.category === "image") {
                        $scope.isImage = true;
                    }
                });
                if (!$scope.isImage) {
                    myDiagram.model.addNodeData({category: "image", key: 99, layer: "Background"});
                }

            });
        });


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

        $rootScope.$on('addItem', function (event, category, name, isText) {
            if (category === "dayTemp" || category === "nightTemp") {
                myDiagram.model.addNodeData({category: category, text: "-"});
            } else if (!isText) {
                myDiagram.model.addNodeData({category: category});
            } else {
                myDiagram.model.addNodeData({category: category, text: name});
            }
        });


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
        var showToast = function (msg, delay) {
            var pinTo = $scope.getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent(msg)
                    .position(pinTo)
                    .hideDelay(delay * 1000)
            );
        };


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
    .controller('SchemeViewCtrl', function ($scope, SchemeService, $mdToast, $routeParams, ngstomp, $log) {

        $scope.$on('$routeChangeStart', function (next, current) {
            ngstomp.unsubscribe("/data/updater");
        });

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


        var changePumpColor = function (color) {
            var arr = myDiagram.model.nodeDataArray;

            for (var i = 0; i < arr.length; i++) {
                var data = arr[i];

                if (data.category === "Pump") {
                    data.color = color;
                    myDiagram.model.updateTargetBindings(data);
                }
            }
        };
        var changePumpState = function () {
            $log.info($scope.sauterCoilVal);
            var coilVal;
            if ($scope.sauterCoilVal === 1) {
                coilVal = 0;
                showToast("Выключение насоса", 15);
            } else {
                coilVal = 1;
                showToast("Включение насоса", 15);
            }
            ngstomp.send("/app/set", {
                element: "write_coil_57",
                value: coilVal
            });
        };
        myDiagram.nodeTemplateMap.add("Pump",
            $(go.Node, go.Panel.Spot,
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("layerName", "layer"),
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


        myDiagram.nodeTemplateMap.add("threeWayValve",
            $(go.Node, go.Panel.Spot,
                {
                    locationSpot: new go.Spot(0.5, 1, 0, -21), locationObjectName: "SHAPE",
                    selectionObjectName: "SHAPE", rotatable: true
                },
                new go.Binding("angle").makeTwoWay(),
                new go.Binding("layerName", "layer"),
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Picture, {
                    desiredSize: new go.Size(50, 50),
                    source: "/resources/img/icons/scheme/threeWayValve.svg",
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
                    }).ofObject()
                )));



        var createDiagramItem = function (name, category, path) {

            myDiagram.nodeTemplateMap.add(category,
                $(go.Node, go.Panel.Position,
                    new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                    new go.Binding("layerName", "layer"),
                    $(go.Shape, "Rectangle",
                        {
                            name: "TABLESHAPE",
                            position: new go.Point(0, 0),
                            desiredSize: new go.Size(250, 80),
                            fill: "#ffbe00", stroke: null
                        }),
                    $(go.TextBlock, {
                        editable: true,
                        font: "bold 11pt Verdana, sans-serif",
                        position: new go.Point(0, 0),
                        text: name
                    }),
                    $(go.Panel, "Auto",
                        {
                            column: 1,
                            position: new go.Point(20, 30)
                        },
                        $(go.TextBlock,
                            {
                                font: "10pt Verdana, sans-serif",
                                width: 50,
                                text: "-"

                            },
                            new go.Binding("text").makeTwoWay(function (count) {
                                return parseInt(count, 10);
                            })
                        )
                    ),
                    $(go.Panel, "Horizontal",
                        {
                            column: 2,
                            position: new go.Point(80, 30)
                        },
                        $("Button",
                            {
                                click: function () {
                                    console.log(path);

                                    ngstomp
                                        .send('/app/ECL300', "read_ram " + path);
                                }
                            },
                            $(go.TextBlock, "Обновить", {margin: 3, desiredSize: new go.Size(70, 14)})
                        )
                    )));
        };

        eclReadItems.forEach(function (item) {
            createDiagramItem(item.name, item.category, item.path);
        });
        eclWriteItems.forEach(function (item) {
            createDiagramItem(item.name, item.category, item.path);
        });

        myDiagram.nodeTemplateMap.add("dayTemp",
            $(go.Node, go.Panel.Position,
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("layerName", "layer"),
                $(go.Shape, "Rectangle",
                    {
                        name: "TABLESHAPE",
                        position: new go.Point(0, 0),
                        desiredSize: new go.Size(200, 100),
                        fill: "#ffbe00", stroke: null
                    }),
                $(go.TextBlock, {
                    editable: true,
                    font: "bold 11pt Verdana, sans-serif",
                    position: new go.Point(0, 0),
                    text: "Дневная температура"
                }),
                $(go.Panel, "Auto", {
                        column: 1,
                        position: new go.Point(20, 30)
                    },
                    $(go.Shape, {fill: "#F2F2F2"}),
                    $(go.TextBlock, {
                            font: "10pt Verdana, sans-serif",
                            textAlign: "right", margin: 2,
                            width: 50,
                            isMultiline: false,
                            text: "-",
                            textValidation: isValidCount
                        },
                        new go.Binding("text").makeTwoWay(function (count) {
                            return parseFloat(count);
                        })
                    )
                ),
                $(go.Panel, "Horizontal", {
                        column: 2,
                        position: new go.Point(80, 30)
                    },
                    $("Button", {
                            click: incrementCount
                        },
                        $(go.Shape, "PlusLine", {margin: 3, desiredSize: new go.Size(7, 7)})
                    ),
                    $("Button", {
                            click: decrementCount
                        },
                        $(go.Shape, "MinusLine", {margin: 3, desiredSize: new go.Size(7, 7)})
                    )),
                $("Button", {
                        click: setDayTemp,
                        position: new go.Point(20, 60)
                    },
                    $(go.TextBlock, {
                            text: "Готово"
                        }
                    )
                )
            ));

        myDiagram.nodeTemplateMap.add("nightTemp",
            $(go.Node, go.Panel.Position,
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("layerName", "layer"),
                $(go.Shape, "Rectangle", {
                    name: "TABLESHAPE",
                    position: new go.Point(0, 0),
                    desiredSize: new go.Size(200, 100),
                    fill: "#008dff", stroke: null
                }),
                $(go.TextBlock, {
                    editable: true,
                    font: "bold 11pt Verdana, sans-serif",
                    position: new go.Point(0, 0),
                    text: "Ночная температура"
                }),
                $(go.Panel, "Auto", {
                        column: 1,
                        position: new go.Point(20, 30)
                    },
                    $(go.Shape, {fill: "#F2F2F2"}),
                    $(go.TextBlock, {
                            font: "10pt Verdana, sans-serif",
                            textAlign: "right", margin: 2,
                            width: 50,
                            isMultiline: false,
                            text: "-",
                            textValidation: isValidCount
                        },
                        new go.Binding("text").makeTwoWay(function (count) {
                            return parseFloat(count);
                        })
                    )
                ),
                $(go.Panel, "Horizontal", {
                        column: 2,
                        position: new go.Point(80, 30)
                    },
                    $("Button", {
                            click: incrementCount
                        },
                        $(go.Shape, "PlusLine", {margin: 3, desiredSize: new go.Size(7, 7)})
                    ),
                    $("Button", {
                            click: decrementCount
                        },
                        $(go.Shape, "MinusLine", {margin: 3, desiredSize: new go.Size(7, 7)})
                    )),
                $("Button", {
                        click: setNightTemp,
                        position: new go.Point(20, 60)
                    },
                    $(go.TextBlock, {
                            text: "Готово"
                        }
                    )
                )
            ));


        function setDayTemp() {
            myDiagram.model.nodeDataArray.forEach(function (val) {
                if (val.category === "dayTemp") {
                    showToast("Изменение дневной температуры");
                    ngstomp.send("/app/set", {
                        element: "day_setpoint_rk1",
                        value: val.text
                    });

                }
            });
        }

        function setNightTemp() {
            myDiagram.model.nodeDataArray.forEach(function (val) {
                if (val.category === "nightTemp") {
                    showToast("Изменение ночной температуры");
                    ngstomp.send("/app/set", {
                        element: "night_setpoint_rk1",
                        value: val.text
                    });
                }
            });
        }

        // Validation function for editing text
        function isValidCount(newstr) {
            if (newstr === "") return false;
            var num = +newstr; // quick way to convert a string to a number
            return !isNaN(num) && Number.isInteger(num) && num >= 0;
        }

        // When user hits + button, increment count on that option
        function incrementCount(e, obj) {
            var slicedata = obj.panel.panel.data;
            var value = slicedata.text;
            var category = slicedata.category;
            changeVal(category, +value + 0.5);
        }

        // When user hits - button, decrement count on that option
        function decrementCount(e, obj) {
            var slicedata = obj.panel.panel.data;
            var value = +slicedata.text;
            var category = slicedata.category;
            changeVal(category, value - 0.5);
        }


        myDiagram.nodeTemplateMap.add("image",
            $(go.Part,
                $(go.Picture, "/scheme/getImgBySchemeId?schemeId=" + schemeId),
                new go.Binding("layerName", "layer")
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
                    resegmentable: true
                },
                new go.Binding("fromSpot", "fromSpot", function (d) {
                    return spotConverter(d);
                }),
                new go.Binding("toSpot", "toSpot", function (d) {
                    return spotConverter(d);
                }),
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

                $scope.nodes.forEach(function (val) {
                    if (val.links === null) {
                        delete(val.color);
                    }
                });

                $scope.links.forEach(function (obj) {
                    if (obj.category === null) {
                        delete(obj.category);
                    }
                    if (obj.angle === null) {
                        delete (obj.angle);
                    }
                    if (obj.pos === null) {
                        delete (obj.pos);
                    }
                    if (obj.text === null) {
                        delete (obj.text);
                    }
                });

                myDiagram.model = new go.GraphLinksModel($scope.nodes, $scope.links);

                ngstomp
                    .subscribeTo('/data/updater')
                    .callback(whatToDoWhenMessageComming)
                    .withBodyInJson()
                    .connect();

                ngstomp.send("/app/hello", "hello");

            });
        });


        var showToast = function (msg, delay) {
            var pinTo = $scope.getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent(msg)
                    .position(pinTo)
                    .hideDelay(delay * 1000)
            );
            $scope.toastShowed = true;
        };


        var changeVal = function (category, value) {
            myDiagram.model.nodeDataArray.forEach(function (val) {
                if (val.category === category) {
                    val.text = value;
                    myDiagram.model.updateTargetBindings(val);
                }
            });
        };

        var changeSauterCoilVal = function (val) {
            if (val === "true") {
                changePumpColor("#15dd00");
                $scope.sauterCoilVal = 1;
            } else {
                changePumpColor("#dd0006");
                $scope.sauterCoilVal = 0;
            }
        };


        function whatToDoWhenMessageComming(message) {
            var wsData = message.body;
            $log.info(wsData);
            parseData(wsData);
        }

        var hideToast = function (message) {
            if ($scope.toastShowed === true) {
                showToast(message, 3);
                $scope.toastShowed = false;
            }
        };
        var parseData = function (data) {
            if (data.Daysetpoint) {
                changeVal("dayTemp", data.Daysetpoint);
                hideToast("Значение дневной уставки установлено")
            }
            if (data.Nightsetpoint) {
                changeVal("nightTemp", data.Nightsetpoint);
                hideToast("Значение ночной уставки установлено")
            }
            if (data.bitTerminal6) {
                changeSauterCoilVal(data.bitTerminal6);
                hideToast("Положение насоса установлено")
            }
            if (data.ControlSignalRK1) {
                changeVal("threeWayValve", data.ControlSignalRK1);
                hideToast("Положение трехпозиционного клапана установлено");
            }

            if (data.register){
                eclReadItems.forEach(function (item) {
                    if (data.register === item.path){
                        changeVal(item.category, data.value);
                        showToast("Здачение для " + item.name + " установлено", 3);
                    }
                });
                eclWriteItems.forEach(function (item) {
                    if (data.register === item.path){
                        changeVal(item.category, data.value);
                        showToast("Здачение для " + item.name + " установлено", 3);
                    }
                });

            }
            $log.info(data);
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

        var browsers = ["Firefox", 'Chrome', 'Trident'];

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