sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"Ingles/Mock/MassPrice/controller/ValueHelper"	
], function (Controller, ValueHelper) {
	"use strict";

	return Controller.extend("Ingles.Mock.MassPrice.controller.MaterialSearch", {
		onInit: function () {
			this.eventBus = sap.ui.getCore().getEventBus();
			this._vendorValueHelp = new ValueHelper(this, 'VENDOR');
		},
		
		onSearchPress: function(ev) {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.navTo("detail", {layout: "TwoColumnsMidExpanded"},true);
			this.eventBus.publish("viewMassMaintenance", "DataPasing", {});
		},
		
		onVendorValueHelp: function (oEvent) {
			this._vendorValueHelp.openValueHelp(oEvent);
		},			
		
		tokenUpdate: function (oEvent, oPath) {
			var sType = oEvent.getParameter("type"),
				aAddedTokens = oEvent.getParameter("addedTokens"),
				aRemovedTokens = oEvent.getParameter("removedTokens"),
				oModel = this.getView().getModel("appControl"),
				aContexts = oModel.getProperty(oPath);

			switch (sType) {
				// add new context to the data of the model, when new token is being added
			case "added":
				aAddedTokens.forEach(function (oToken) {
					aContexts.push({
						key: oToken.getKey(),
						text: oToken.getKey()
					});
				});
				break;
				// remove contexts from the data of the model, when tokens are being removed
			case "removed":
				aRemovedTokens.forEach(function (oToken) {
					aContexts = aContexts.filter(function (oContext) {
						return oContext.key !== oToken.getKey();
					});
				});
				break;
			default:
				break;
			}

			oModel.setProperty(oPath, aContexts);

		}		
		
	});
});