jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 SQL in the list
// * All 3 SQL have at least one Schedule

sap.ui.require([
	"sap/ui/test/Opa5",
	"da/sql/publish/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"da/sql/publish/test/integration/pages/App",
	"da/sql/publish/test/integration/pages/Browser",
	"da/sql/publish/test/integration/pages/Master",
	"da/sql/publish/test/integration/pages/Detail",
	"da/sql/publish/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "da.sql.publish.view."
	});

	sap.ui.require([
		"da/sql/publish/test/integration/MasterJourney",
		"da/sql/publish/test/integration/NavigationJourney",
		"da/sql/publish/test/integration/NotFoundJourney",
		"da/sql/publish/test/integration/BusyJourney",
		"da/sql/publish/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});