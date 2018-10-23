jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"da/publish/test/integration/NavigationJourneyPhone",
		"da/publish/test/integration/NotFoundJourneyPhone",
		"da/publish/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});