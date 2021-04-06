sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/ingles/retail_pricing/mass_price/mass_price/model/models",
	"sap/base/util/UriParameters",
	"sap/ui/model/json/JSONModel",
	"sap/f/library",
	"sap/f/FlexibleColumnLayoutSemanticHelper"
], function (UIComponent, Device, models,UriParameters, JSONModel, library, FlexibleColumnLayoutSemanticHelper) {
	"use strict";
	
	var LayoutType = library.LayoutType;
	
	return UIComponent.extend("com.ingles.retail_pricing.mass_price.mass_price.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			var oModel = new JSONModel();
			this.setModel(oModel);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.onewModel(), "query");
			this.setModel(models.appControlModel(), "appControl");
			this.setModel(models.masterDataModel(), "MasterDataModel");				
		},
		getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
				oParams = jQuery.sap.getUriParameters(), //UriParameters.fromQuery(location.search),
				oSettings = {
					defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
					mode: oParams.get("mode"),
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}
	});
});