sap.ui.define([
		"da/sql/publish/model/GroupSortState",
		"sap/ui/model/json/JSONModel"
	], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function() {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("ID").length, 1, "The sorting by ID returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("S_CODE").length, 1, "The sorting by S_CODE returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("ID").length, 1, "The group by ID returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to ID if the user groupes by ID", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("ID");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "ID", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by S_CODE and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "ID");

		this.oGroupSortState.sort("S_CODE");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});