# AngularJS SpinKit HTTP Loading
Directive for AngularJS to display [tobiasahlin's SpinKit](https://github.com/tobiasahlin/SpinKit) css loading indicators on HTTP requests.

## Demo and examples
You can find more demos and examples here: https://ybrodsky.github.io/angularjs-spinkit-loader

## What does it do exactly?
It displays one of [tobiasahlin's SpinKit](https://github.com/tobiasahlin/SpinKit) css loading while there's 
an HTTP request being processed.

## Usage
1. Include [tobiasahlin's SpinKit](https://github.com/tobiasahlin/SpinKit) css
2. Include AngularJS SpinKit js file
3. Include the directive

```html
	<head>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spinkit/1.2.5/spinkit.min.css">
		<script src="spinkit-loader.min.js"></script>
	</head>
	<body>
		<ng-loader></ng-loader>
	</body>
```

```js
	var myApp = angular.module('myApp', ['spinkitLoader']);
```

## Options
You can select between the available SpinKit indicators

```
	sk-rotating-plane
  sk-double-bounce
  sk-wave
  sk-wandering-cubes
  sk-spinner-pulse
  sk-chasing-dots
  sk-three-bounce
  sk-circle
  sk-cube-grid
  sk-fading-circle
  sk-folding-cube
```

```html
	<ng-loader settings="{spinkit: 'sk-rotating-plane'}"></ng-loader>
```

You can in addition, pass two more configuration options *class*, a class to be applied to the loading indicator (usefull for changing it's color); and *containerClass*, a class to be applied to the loading indicator container (usefull for adding an overlay)

```html
	<ng-loader settings="{spinkit: 'sk-rotating-plane', class: 'red', containerClass: 'myContainer'}"></ng-loader>
```

