/*global location */
sap.ui.define([
		"da/sql/publish/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"da/sql/publish/model/formatter"
	], function (BaseController, JSONModel, formatter) {
		"use strict";

		return BaseController.extend("da.sql.publish.controller.Detail", {

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
		onEdit: function(oEvent) {
				var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
				this._getDialog().setModel(userModel, "userapi");
				this._getDialog().open();
		},

		_getDialog: function() {
			if (!this._oDialog) { 
				this._oDialog = sap.ui.xmlfragment("da.sql.publish.view.EditEntry", this);
				this.getView().addDependent(this._oDialog);
			} 
				var oViewModel = this.getModel("detailView");
				var ahead = Number(this.getView().byId('objectHeader').mProperties.number);
/*			https://ch00sdb5q.eu.mt.mtnet:51076/ExtractData.xsodata/VARIANT?$format=json&$filter=(VID eq 1 and ID eq 1)&$select=FILTER */

			var url = '/ExtractSQLData.xsodata/SQL?$format=json&$filter=(ID eq ' + ahead + ' )&$select=S_CODE,TFOLDER,TFILE,CRON,FUNCTION,SCHID,OUTCOLS';
			var outcols; var cron;
			var folder; var file; var s_code;
			var func;
			var schid;
			jQuery.ajax({
				async: false,
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				url: url,
				error: function(jqXHR, textStatus, errorThrown) {

				},

				success: function(oData, textStatus, jqXHR) {
					s_code = oData.d.results[0].S_CODE;
					cron = oData.d.results[0].CRON;
					folder = oData.d.results[0].TFOLDER;
					file = oData.d.results[0].TFILE;
					func = oData.d.results[0].FUNCTION;
					schid = oData.d.results[0].SCHID;
					outcols = oData.d.results[0].OUTCOLS;
				}
			});
			
				sap.ui.getCore().byId("Editfunction").setValue(func);
				sap.ui.getCore().byId("EditSQLCode").setValue(s_code);
				sap.ui.getCore().byId("EditOutcols").setValue(outcols);
				sap.ui.getCore().byId("EditSchedule").setValue(cron);
				sap.ui.getCore().byId("EditTfolder").setValue(folder);
				sap.ui.getCore().byId("EditTFile").setValue(file);
				sap.ui.getCore().byId("EditSCHID").setValue(schid);
			return this._oDialog;
			
		},

		onDelete: function() {
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();

			var url = "/DeleteSQL.xsjs";			
			var ahead = Number(this.getView().byId('objectHeader').mProperties.number);			
			var oData = {
				"ID": ahead
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
		onPosSave:  function() {

			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();

			var url = "/UpdateNumber.xsjs";
			
			var ahead = Number(this.getView().byId('objectHeader').mProperties.number);
			var aItems = this.getView().byId('lineItemsList').getItems();
			var position;
			var aSelectedItems = [];
			var j = 0;
			for (var i=0; i<aItems.length;i++) {
	   			if (aItems[i].getSelected()) {
    	   			aSelectedItems.push(aItems[i]);
    	   			
    	   			if (j > 0){
    	   				position = position +   ','   + Number(aSelectedItems[j].getCells()[1].getNumber());
    	   			}else {
    	   				position = Number(aSelectedItems[j].getCells()[1].getNumber());	
    	   			}
    	   			j = j + 1;
    			}
			}
			
			var oData = {
				"ID": ahead,
				"POSITION": String(position)
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
					}
				});
				this.onRefresh();
		},
		onEditSave: function() {

			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();

			var url = "/UpdateSQLData.xsjs";

			var tfolder = sap.ui.getCore().getElementById('EditTfolder').getValue();
			var tfile = sap.ui.getCore().getElementById('EditTFile').getValue();
			var schedule = sap.ui.getCore().getElementById('EditSchedule').getValue();
			var OutCol = sap.ui.getCore().getElementById('EditOutcols').getValue();
			var Schid = sap.ui.getCore().getElementById('EditSCHID').getValue();
			var Scode = sap.ui.getCore().getElementById('EditSQLCode').getValue();
			var Func = sap.ui.getCore().getElementById('Editfunction').getValue();
			
			var ahead = Number(this.getView().byId('objectHeader').mProperties.number);
				
			var oData = {
				"ID": ahead,
				"Cron": schedule,
				"TFolder": tfolder,
				"TFile": tfile,
				"OutCol": OutCol,
				"Scode": Scode,
				"Schid":Schid,
				"Function":Func
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
		onEditCancelDialog: function() {
			this._oDialog.close();
		},
		
			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = this.getModel("detailView");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("detailView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name : "sap.collaboration.components.fiori.sharing.dialog",
						settings : {
							object :{
								id : location.href,
								share : oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});

				oShareDialog.open();
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
     // trying to pre-select row and show detail
     var aItems = this.getView().byId('lineItemsList').getItems();
	var ahead = Number(this.getView().byId('objectHeader').mProperties.number);

	var url = '/ExtractSQLData.xsodata/SQL_HEAD?$format=json&$filter=(ID eq ' + ahead +  ' )&$select=ISNUMBER,POSITION';
	var position  = [];
			jQuery.ajax({
				async: false,
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				url: url,
				error: function(jqXHR, textStatus, errorThrown) {
				},

				success: function(oData, textStatus, jqXHR) {
					for (var j=0; j<oData.d.results.length; j++){
						if (oData.d.results[j].ISNUMBER == 'X') {
						position.push(oData.d.results[j].POSITION);
						}
					} 
				}
			});
     
		for (var i=0; i<position.length;i++) {
			var k = position[i] - 1;
			aItems[k].setSelected(true);
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
					var sObjectPath = this.getModel().createKey("SQL", {
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
					sObjectName = oObject.S_CODE,
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