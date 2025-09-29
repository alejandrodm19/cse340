// controllers/invController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invController = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = utilities.handleErrors(
  async (req, res) => {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Vehicles";
    return res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  }
);

/* ***************************
 *  Build single vehicle detail view
 * ************************** */
invController.buildDetail = utilities.handleErrors(async (req, res) => {
  const nav = await utilities.getNav();
  const invId = Number(req.params.invId);
  const vehicle = await invModel.getVehicleById(invId);
  const detail = utilities.buildVehicleDetail(vehicle);
  const title = vehicle
    ? `${vehicle.inv_make} ${vehicle.inv_model}`
    : "Vehicle";
  return res.render("inventory/detail", { title, nav, detail });
});

module.exports = invController;
