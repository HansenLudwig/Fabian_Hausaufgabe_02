sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("UI.App", {
      onInit: async function () {
        const meterReadings = await fetch("/server/meterReadings");
        const meterReadingsData = await meterReadings.json();

        const oModel = new JSONModel();
        oModel.setData(meterReadingsData);
        this.getView().setModel(oModel, "data");
      },
    });
  }
);
