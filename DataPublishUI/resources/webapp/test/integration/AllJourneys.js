jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 HEADER in the list
// * All 3 HEADER have at least one Schedule

sap.ui.require([
	"sap/ui/test/Opa5",
	"da/publish/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"da/publish/test/integration/pages/App",
	"da/publish/test/integration/pages/Browser",
	"da/publish/test/integration/pages/Master",
	"da/publish/test/integration/pages/Detail",
	"da/publish/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "da.publish.view."
	});

	sap.ui.require([
		"da/publish/test/integration/MasterJourney",
		"da/publish/test/integration/NavigationJourney",
		"da/publish/test/integration/NotFoundJourney",
		"da/publish/test/integration/BusyJourney",
		"da/publish/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});