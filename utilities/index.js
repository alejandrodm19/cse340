// utilities/index.js
const invModel = require("../models/inventory-model");

const Util = {};

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ************************
 * Builds the nav <ul>
 ************************ */
Util.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = '<ul class="menu">';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}"
         title="See our inventory of ${row.classification_name} vehicles">
         ${row.classification_name}
      </a>
    </li>`;
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build classification grid
 ************************************** */
Util.buildClassificationGrid = function (data) {
  let grid;
  if (data && data.length) {
    grid = '<ul id="inv-display" class="inv-grid">';
    data.forEach((v) => {
      grid += `<li class="inv-card">
        <a href="/inv/detail/${v.inv_id}"
           title="View ${v.inv_make} ${v.inv_model} details">
          <img src="${v.inv_thumbnail}"
               alt="Image of ${v.inv_make} ${v.inv_model} on CSE Motors" />
          <div class="namePrice">
            <hr />
            <h2>${v.inv_make} ${v.inv_model}</h2>
            <span>$${new Intl.NumberFormat("en-US").format(v.inv_price)}</span>
          </div>
        </a>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build single vehicle detail HTML
 ************************************** */
Util.buildVehicleDetail = function (v) {
  if (!v) return '<p class="notice">Vehicle not found.</p>';
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(v.inv_price));
  const miles =
    v.inv_miles != null
      ? new Intl.NumberFormat("en-US").format(Number(v.inv_miles))
      : "N/A";

  return `
    <article class="vehicle-detail">
      <figure class="vehicle-detail__media">
        <img src="${v.inv_image}" alt="Image of ${v.inv_make} ${v.inv_model}" />
      </figure>
      <div class="vehicle-detail__info">
        <h2 class="vehicle-detail__title">${v.inv_year} ${v.inv_make} ${v.inv_model}</h2>
        <p class="vehicle-detail__price"><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${miles}</p>
        <p><strong>Classification:</strong> ${v.classification_name}</p>
        <hr />
        <p class="vehicle-detail__desc">${v.inv_description}</p>
      </div>
    </article>
  `;
};

module.exports = Util;
