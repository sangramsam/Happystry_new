'use strict';

/**
 * Main module for the applications
 * @namespace Happystry
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * @version 1.0
 */
var app = angular.module('Happystry', [
			'ui.router',
			'angular-svg-round-progressbar',
			'Happystry.controllers',
			'Happystry.services',
			'Happystry.router',
			'Happystry.directives',
			'Happystry.filters'
		]
	);

angular.module('Happystry.controllers', ['ui.bootstrap']);
angular.module('Happystry.directives', ['ui.bootstrap']);
angular.module('Happystry.services', []);
angular.module('Happystry.filters', []);
angular.module('Happystry.router', []);

