jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"da/sql/publish/test/integration/NavigationJourneyPhone",
		"da/sql/publish/test/integration/NotFoundJourneyPhone",
		"da/sql/publish/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});