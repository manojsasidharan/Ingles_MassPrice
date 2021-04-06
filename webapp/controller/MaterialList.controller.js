sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/MessageView",
	"sap/m/Dialog",
	"sap/m/Bar",
	"sap/m/Text",
	"sap/m/MessageItem",
	"sap/ui/core/IconPool",
	"sap/m/MessagePopover",
	"sap/ui/core/message/Message",
	"sap/ui/core/Core"
	
], function (Controller, JSONModel,Button,MessageView,Dialog, Bar, Text,MessageItem,IconPool, MessagePopover, Message,Core) {
	"use strict";

	return Controller.extend("com.ingles.retail_pricing.mass_price.mass_price.controller.MaterialList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Ingles.AddOn.MaterialMassMaintenance.view.MaterialList
		 */
		onInit: function () {
			this.eventBus = sap.ui.getCore().getEventBus();
			this.oRouter = this.getOwnerComponent().getRouter();

			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);

			this.eventBus.subscribe("reviewMassUpdate", "DataPasing", this.onMassUpdateFields, this);
			this.eventBus.subscribe("viewMassMaintenance", "DataPasing", this.onViewMassMaintenance, this);

			this.getView().setModel(new JSONModel({
				view: "View"
			}), "Maintenance");

			this.getView().setModel(new JSONModel([{
				name: "Price Level = *****"
			}, {
				name: "Price Type = *****"
			}, {
				name: "Price Strategy = ******"
			}, {
				name: "From Date >= *****"
			}, {
				name: "To Date <= *****"
			}]), "filterModel");
			
			this._messageManager = Core.getMessageManager();
			this._messageManager.registerObject(this.getView(), true);
			this.oView.setModel(this._messageManager.getMessageModel(), "message");
		},

		isNewValue: function (oldValue, newValue) {
			return (oldValue === newValue) ? false : true;
		},

		isOldValue: function (oldValue, newValue) {
			return (oldValue === newValue) ? true : false;
		},

		onCancelMassUpdate: function () {
			this.onViewMassMaintenance("", "", "");
		},

		onMassUpdate: function () {
			this.onViewMassMaintenance("", "", "");
			sap.ui.getCore().getMessageManager().removeAllMessages();
			this.addMessageToTarget("", "", "SAP Promo document number xxxx created successfully!!", "Success",
				"",
				"S", "");

			//this.addMessageToTarget("", "", "Please enter valid Price", "Error", "Please check the Price at Row 2", "E", "");

			this.createdialog();
		},
		createdialog: function () {
			var that = this;
			var oBackButton = new Button({
				icon: IconPool.getIconURI("nav-back"),
				visible: false,
				press: function () {
					that.oMessageView.navigateBack();
					this.setVisible(false);
				}
			});

			this.oMessageView = new MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: "message>/",
					template: new MessageItem({
						title: "{message>message}",
						subtitle: "{message>additionalText}",
						activeTitle: true,
						description: "{message>description}",
						type: "{message>type}"
					})
				},
				groupItems: true
			});

			this.getView().addDependent(this.oMessageView);
			this.oDialog = new Dialog({
				content: this.oMessageView,
				contentHeight: "50%",
				contentWidth: "50%",
				endButton: new Button({
					text: "Close",
					press: function () {
						this.getParent().close();
					}
				}),
				customHeader: new Bar({
					contentMiddle: [
						new Text({
							text: "Confirmation"
						})
					],
					contentLeft: [oBackButton]
				}),

				verticalScrolling: false
			});
			this.oMessageView.navigateBack();
			this.oDialog.open();
		},
		createMessagePopover: function () {
			this.oMP = new MessagePopover({
				items: {
					path: "message>/",
					template: new MessageItem({
						title: "{message>message}",
						subtitle: "{message>additionalText}",
						activeTitle: true,
						description: "{message>description}",
						type: "{message>type}"
					})
				}
			});
			this.oMP._oMessageView.setGroupItems(true);
			this.oMP._oPopover.setContentWidth("600px");
			this.oView.addDependent(this.oMP);
		},
		addMessageToTarget: function (sTarget, controlId, errorMessage, errorTitle, errorDescription, msgType, groupName) {
			var oMessage = new Message({
				message: errorMessage,
				type: this.getMessageType(msgType),
				additionalText: errorTitle,
				description: errorDescription,
				target: sTarget,
				processor: this._mainModel,
				code: groupName
			});

			if (controlId !== "") {
				oMessage.addControlId(controlId);
			}

			this._messageManager.addMessages(oMessage);
		},
		getMessageType: function (msgType) {
			var rtnType;
			switch (msgType) {
			case "E":
				rtnType = sap.ui.core.MessageType.Error;
				break;
			case "S":
				rtnType = sap.ui.core.MessageType.Success;
				break;
			case "I":
				rtnType = sap.ui.core.MessageType.Information;
				break;
			case "W":
				rtnType = sap.ui.core.MessageType.Warning;
				break;
			default:
				rtnType = sap.ui.core.MessageType.None;
				break;
			}
			return rtnType;
		},

		onMassUpdateFields: function (oChannel, oEvent, mData) {
			this.getView().setModel(new JSONModel({
				view: "Review"
			}), "Maintenance");
		},

		onViewMassMaintenance: function (oChannel, oEvent, mData) {
			this.getView().setModel(new JSONModel({
				view: "View"
			}), "Maintenance");
		},

		isView: function (mData) {
			return (mData.view === "View") ? true : false;
		},

		isReview: function (mData) {
			return (mData.view === "Review") ? true : false;
		},

		_onProductMatched: function (oEvent) {
			this.layout = oEvent.getParameter("arguments").layout || this.layout || "TwoColumnMidExpanded";
			this.routeName = oEvent.getParameters().name;
			this.getView().setModel(new JSONModel({
				view: this.layout,
				routeName: this.routeName
			}), "layout");
		},

		isNotFullScreen: function (mLayout) {
			if (this.routeName === "detail") {
				return (mLayout === "TwoColumnsMidExpanded") ? true : false;
			}
			return false;
		},

		isFullScreen: function (mLayout) {
			if (this.routeName === "detail") {
				return (mLayout === "TwoColumnsMidExpanded") ? false : true;
			}
			return false;
		},

		exitFullScreen: function () {
			if (this.routeName === "detail") {
				this.oRouter.navTo("detail", {
					layout: "TwoColumnsMidExpanded"
				}, true);
			} else if (this.routeName === "detailDetail") {
				this.oRouter.navTo("detailDetail", {
					layout: "TwoColumnsBeginExpanded"
				}, true);
			}
		},

		enterFullScreen: function () {
			if (this.routeName === "detail") {
				this.oRouter.navTo("detail", {
					layout: "MidColumnFullScreen"
				}, true);
			} else if (this.routeName === "detailDetail") {
				this.oRouter.navTo("detailDetail", {
					layout: "OneColumn"
				}, true);
			}
		},

		cancelDetail: function () {
			this.oRouter.navTo("master", {
				layout: "OneColumn"
			}, true);
		},

		getMaterialCount: function (mMaterials) {
			if (mMaterials && mMaterials !== null && mMaterials !== undefined) {
				if (mMaterials.length > 0) {
					return mMaterials.length + " Item" + ((mMaterials.length > 1) ? "s" : "") + " Found";
				}
			}
			return "No Item Found!";
		},

		materialRowSelect: function (ev) {
			var aIndices = ev.getSource().getSelectedIndices();
			if (aIndices.length < 1) {
				this.oRouter.navTo("detail", {
					layout: "TwoColumnsMidExpanded"
				}, true);
			} else {
				this.oRouter.navTo("detailDetail", {
					layout: "TwoColumnsBeginExpanded"
				}, true);
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Ingles.AddOn.MaterialMassMaintenance.view.MaterialList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Ingles.AddOn.MaterialMassMaintenance.view.MaterialList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Ingles.AddOn.MaterialMassMaintenance.view.MaterialList
		 */
		//	onExit: function() {
		//
		//	}

	});

});