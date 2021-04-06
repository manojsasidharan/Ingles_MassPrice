sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.ingles.retail_pricing.mass_price.mass_price.controller.MaterialSearch", {
		onInit: function () {
			this.eventBus = sap.ui.getCore().getEventBus();
		},
		
		onSearchPress: function(ev) {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.navTo("detail", {layout: "TwoColumnsMidExpanded"},true);
			this.eventBus.publish("viewMassMaintenance", "DataPasing", {});
		}
	});
});