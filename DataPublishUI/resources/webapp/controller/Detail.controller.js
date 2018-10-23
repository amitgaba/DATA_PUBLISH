/*global location */
sap.ui.define([
		"da/publish/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"da/publish/model/formatter"
	], function (BaseController, JSONModel, formatter) {
		"use strict";

		return BaseController.extend("da.publish.controller.Detail", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
				});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "detailView");

				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
		onEdit: function(oEvent) {
				var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
				this._getDialog().setModel(userModel, "userapi");
				this._getDialog().open();


		},

		onCopy: function(oEvent) {
				var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
				this._getDialog().setModel(userModel, "userapi");
				this._getDialog().open();


		},		
		onDelete: function(oEvent) {

			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();
			var url = "/DeleteItem.xsjs";

			var oViewModel = this.getModel("detailView");
			var ahead = Number(this.getView().byId('objectHeader').mProperties.number);
			var aItems = this.getView().byId('lineItemsList').getItems();
		
			var aSelectedItems = [];
			for (var i=0; i<aItems.length;i++) {
	   			if (aItems[i].getSelected()) {
    	   			aSelectedItems.push(aItems[i]);
    			}
			}
			var aitem = Number(aSelectedItems[0].getCells()[0].getText());
			var aVid = Number(aSelectedItems[0].getCells()[1].getNumber());
				
				var oData = {
					"ID": ahead,
					"ITEMID": aitem,
					"VID": aVid
				};


				jQuery
					.ajax({
						type: "POST",
						data: JSON.stringify(oData),
						dataType: "json",
						contentType: "application/json",
						url: url,
					success: function(reserv) {
						sap.m.MessageToast.show("Deletion Successful");
						oGlobalBusyDialog.close();
					}
				});
				this.onRefresh();			

		},
		onCopyCancelDialog: function() {
			this._oDialog.close();
		},
		
		onEditCancelDialog: function() {
			this._oDialog.close();
		},
		_getEditDialog: function() {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("da.publish.view.EditEntry", this);
				this.getView().addDependent(this._oDialog);
			}

			return this._oDialog;
		},					

		onCancelDialog: function() {
			this._oDialog.close();
		},		
		onEditSave: function() {

			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();

			var url = "/UpdateData.xsjs";


			var tfolder = sap.ui.getCore().getElementById('EditTfolder').getValue();
			var tfile = sap.ui.getCore().getElementById('EditTFile').getValue();
			var schedule = sap.ui.getCore().getElementById('EditSchedule').getValue();
			var filter = sap.ui.getCore().getElementById('EditFilter').getValue();
			var OutCol = sap.ui.getCore().getElementById('EditOutCol').getValue();
			var PlHold = sap.ui.getCore().getElementById('EditPlHold').getValue();
			var schid = sap.ui.getCore().getElementById('EditSCHID').getValue();
			var ToAccess;
			if (sap.ui.getCore().getElementById('EDITACCESS').mProperties.selected) {
				ToAccess = 'X';
				} 
				else {
					ToAccess = "";
					
				}			
			
				var oViewModel = this.getModel("detailView");
				var ahead = Number(this.getView().byId('objectHeader').mProperties.number);
				var aItems = this.getView().byId('lineItemsList').getItems();
				
				var aSelectedItems = [];
				for (var i=0; i<aItems.length;i++) {
    			if (aItems[i].getSelected()) {
        			aSelectedItems.push(aItems[i]);
    			}
				}
				var aitem = Number(aSelectedItems[0].getCells()[0].getText());
				var aVid = Number(aSelectedItems[0].getCells()[1].getNumber());
				
				var oData = {
					"ID": ahead,
					"ITEMID": aitem,
					"VID": aVid,
					"Cron": schedule,
					"Filter": filter,
					"TFolder": tfolder,
					"TFile": tfile,
					"OutCol": OutCol,
					"PlHold": PlHold,
					"Schid":schid,
					"ToAccess":ToAccess					
				};

				jQuery
					.ajax({
						type: "POST",
						data: JSON.stringify(oData),
						dataType: "json",
						contentType: "application/json",
						url: url,
					success: function(reserv) {
						sap.m.MessageToast.show("Updation Successful");
						oGlobalBusyDialog.close();
						this._oDialog.close();						
					}
				});
				this.onRefresh();
		},

		onCopySave: function() {

			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();

			var url = "/SaveData.xsjs";
			
			var functional = sap.ui.getCore().getElementById('function').getValue();
			var viewname = sap.ui.getCore().getElementById('viewname').getValue();
			var schemaname = sap.ui.getCore().getElementById('schemaname').getValue();
			var tfolder = sap.ui.getCore().getElementById('CopyTfolder').getValue();
			var tfile = sap.ui.getCore().getElementById('CopyTFile').getValue();
			var schedule = sap.ui.getCore().getElementById('CopySchedule').getValue();
			var filter = sap.ui.getCore().getElementById('CopyFilter').getValue();
			var OutCol = sap.ui.getCore().getElementById('CopyOutCol').getValue();
			var PlHold = sap.ui.getCore().getElementById('CopyPlHold').getValue();
			var SchID = sap.ui.getCore().getElementById('CopySCHID').getValue();
			var ToAccess;
			if (sap.ui.getCore().getElementById('CopyACCESS').mProperties.selected) {
				ToAccess = 'X';
				} 
				else {
					ToAccess = "";
				}			
				
				var oData = {
					"Function": functional,
					"ViewName": viewname,
					"SchemaName": schemaname,
					"Cron": schedule,
					"Filter": filter,
					"TFolder": tfolder,
					"TFile": tfile,
					"OutCol": OutCol,
					"PlHold": PlHold,
					"SchID": SchID,
					"ToAccess":ToAccess
				};

				jQuery
					.ajax({
						type: "POST",
						data: JSON.stringify(oData),
						dataType: "json",
						contentType: "application/json",
						url: url,
					success: function(reserv) {
						sap.m.MessageToast.show("Creation Successful");
						oGlobalBusyDialog.close();
						this._oDialog.close();
					}
				});
				this.onRefresh();
		},
		_getCopyDialog: function() {
			if (!this._oDialog) { 
				this._oDialog = sap.ui.xmlfragment("da.publish.view.CopyEntry", this);
				this.getView().addDependent(this._oDialog);
			} 
				var oViewModel = this.getModel("detailView");
				var ahead = Number(this.getView().byId('objectHeader').mProperties.number);
				var aItems = this.getView().byId('lineItemsList').getItems();
				
				var aSelectedItems = [];
				for (var i=0; i<aItems.length;i++) {
    			if (aItems[i].getSelected()) {
        			aSelectedItems.push(aItems[i]);
    			}
				}
				var aitem = Number(aSelectedItems[0].getCells()[0].getText());
				var aVid = Number(aSelectedItems[0].getCells()[1].getNumber());
/*			https://ch00sdb5q.eu.mt.mtnet:51076/ExtractData.xsodata/VARIANT?$format=json&$filter=(VID eq 1 and ID eq 1)&$select=FILTER */

			
			var url = '/ExtractData.xsodata/VARIANT?$format=json&$filter=(VID eq ' + aVid + ' and ID eq ' + ahead + ' )&$select=FILTER,PLHOLD,OUTCOLS';
			var filter;	var plhold; var outcols; var cron;
			var folder; var file; var schema;
			var viewname; var func;
			var schid; var access;
			jQuery.ajax({
				async: false,
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				url: url,
				error: function(jqXHR, textStatus, errorThrown) {

				},

				success: function(oData, textStatus, jqXHR) {
					filter = oData.d.results[0].FILTER;
					plhold = oData.d.results[0].PLHOLD;
					outcols = oData.d.results[0].OUTCOLS;
				}

			});
			
		url = '/ExtractData.xsodata/ITEM_S?$format=json&$filter=(VID eq ' + aVid + ' and ID eq ' + ahead + 'and ITEM eq ' + aitem  + ')&$select=CRON,ACCESS,FOLDER,FILE,SCHID';
		jQuery.ajax({
				async: false,
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				url: url,
				error: function(jqXHR, textStatus, errorThrown) {

				},

				success: function(oData, textStatus, jqXHR) {
					cron = oData.d.results[0].CRON;
					folder = oData.d.results[0].FOLDER;
					file = oData.d.results[0].FILE;
					schid = oData.d.results[0].SCHID;
					access = oData.d.results[0].ACCESS;
				}

			});		

		https://ch00sdb5q.eu.mt.mtnet:51076/ExtractData.xsodata/HEADER?$format=json&$filter=(ID eq 3)&$select=SCHEMA_NAME,VIEW_NAME,FUNCTION
		
		url = '/ExtractData.xsodata/HEADER?$format=json&$filter=(ID eq ' + ahead  + ')&$select=SCHEMA_NAME,VIEW_NAME,FUNCTION';
		jQuery.ajax({
				async: false,
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				url: url,
				error: function(jqXHR, textStatus, errorThrown) {

				},

				success: function(oData, textStatus, jqXHR) {
					schema = oData.d.results[0].SCHEMA_NAME;
					viewname = oData.d.results[0].VIEW_NAME;
					func = oData.d.results[0].FUNCTION;
				}

			});				

				sap.ui.getCore().byId("Copyfunction").setValue(func);
				sap.ui.getCore().byId("Copyviewname").setValue(viewname);
				sap.ui.getCore().byId("Copyschemaname").setValue(schema);
			
				sap.ui.getCore().byId("CopyFilter").setValue(filter);
				sap.ui.getCore().byId("CopyPlHold").setValue(plhold);
				sap.ui.getCore().byId("CopyOutCol").setValue(outcols);
				sap.ui.getCore().byId("CopySchedule").setValue(cron);
				sap.ui.getCore().byId("CopyTfolder").setValue(folder);
				sap.ui.getCore().byId("CopyTFile").setValue(file);
				sap.ui.getCore().byId("CopySCHID").setValue(schid);
				if (access == 'X') {
				sap.ui.getCore().byId("CopyACCESS").setSelected(true);
				} else {
					sap.ui.getCore().byId("CopyACCESS").setSelected(false);
				}
				// 
			return this._oDialog;
		},		
		
		_getDialog: function() {
			if (!this._oDialog) { 
				this._oDialog = sap.ui.xmlfragment("da.publish.view.EditEntry", this);
				this.getView().addDependent(this._oDialog);
			} 
				var oViewModel = this.getModel("detailView");
				var ahead = Number(this.getView().byId('objectHeader').mProperties.number);
				var aItems = this.getView().byId('lineItemsList').getItems();
				
				var aSelectedItems = [];
				for (var i=0; i<aItems.length;i++) {
    			if (aItems[i].getSelected()) {
        			aSelectedItems.push(aItems[i]);
    			}
				}
				var aitem = Number(aSelectedItems[0].getCells()[0].getText());
				var aVid = Number(aSelectedItems[0].getCells()[1].getNumber());
/*			https://ch00sdb5q.eu.mt.mtnet:51076/ExtractData.xsodata/VARIANT?$format=json&$filter=(VID eq 1 and ID eq 1)&$select=FILTER */

			
			var url = '/ExtractData.xsodata/VARIANT?$format=json&$filter=(VID eq ' + aVid + ' and ID eq ' + ahead + ' )&$select=FILTER,PLHOLD,OUTCOLS';
			var filter;	var plhold; var outcols; var cron;
			var folder; var file; var schema;
			var viewname; var func;
			var schid; var access;
			jQuery.ajax({
				async: false,
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				url: url,
				error: function(jqXHR, textStatus, errorThrown) {

				},

				success: function(oData, textStatus, jqXHR) {
					filter = oData.d.results[0].FILTER;
					plhold = oData.d.results[0].PLHOLD;
					outcols = oData.d.results[0].OUTCOLS;
				}

			});
			
		url = '/ExtractData.xsodata/ITEM_S?$format=json&$filter=(VID eq ' + aVid + ' and ID eq ' + ahead + 'and ITEM eq ' + aitem  + ')&$select=CRON,ACCESS,FOLDER,FILE,SCHID';
		jQuery.ajax({
				async: false,
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				url: url,
				error: function(jqXHR, textStatus, errorThrown) {

				},

				success: function(oData, textStatus, jqXHR) {
					cron = oData.d.results[0].CRON;
					folder = oData.d.results[0].FOLDER;
					file = oData.d.results[0].FILE;
					schid = oData.d.results[0].SCHID;
					access = oData.d.results[0].ACCESS;
				}

			});		

		https://ch00sdb5q.eu.mt.mtnet:51076/ExtractData.xsodata/HEADER?$format=json&$filter=(ID eq 3)&$select=SCHEMA_NAME,VIEW_NAME,FUNCTION
		
		url = '/ExtractData.xsodata/HEADER?$format=json&$filter=(ID eq ' + ahead  + ')&$select=SCHEMA_NAME,VIEW_NAME,FUNCTION';
		jQuery.ajax({
				async: false,
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				url: url,
				error: function(jqXHR, textStatus, errorThrown) {

				},

				success: function(oData, textStatus, jqXHR) {
					schema = oData.d.results[0].SCHEMA_NAME;
					viewname = oData.d.results[0].VIEW_NAME;
					func = oData.d.results[0].FUNCTION;
				}

			});				

				sap.ui.getCore().byId("Editfunction").setValue(func);
				sap.ui.getCore().byId("Editviewname").setValue(viewname);
				sap.ui.getCore().byId("Editschemaname").setValue(schema);
			
				sap.ui.getCore().byId("EditFilter").setValue(filter);
				sap.ui.getCore().byId("EditPlHold").setValue(plhold);
				sap.ui.getCore().byId("EditOutCol").setValue(outcols);
				sap.ui.getCore().byId("EditSchedule").setValue(cron);
				sap.ui.getCore().byId("EditTfolder").setValue(folder);
				sap.ui.getCore().byId("EditTFile").setValue(file);
				sap.ui.getCore().byId("EditSCHID").setValue(schid);
				if (access == 'X') {
				sap.ui.getCore().byId("EDITACCESS").setSelected(true);
				} else {
					sap.ui.getCore().byId("EDITACCESS").setSelected(false);
				}
				// 
			return this._oDialog;
		},
			/**
			 * Updates the item count within the line item table's header
			 * @param {object} oEvent an event containing the total number of items in the list
			 * @private
			 */
			onListUpdateFinished : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				// only update the counter if the length is final
				if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);
				}
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("HEADER", {
						ID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = decodeURI(oElementBinding.getPath()),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.ID,
					sObjectName = oObject.VIEW_NAME,
					oViewModel = this.getModel("detailView");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView"),
					oLineItemTable = this.byId("lineItemsList"),
					iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);
				oViewModel.setProperty("/lineItemTableDelay", 0);

				oLineItemTable.attachEventOnce("updateFinished", function() {
					// Restore original busy indicator delay for line item table
					oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
				});

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			}

		});

	}
);