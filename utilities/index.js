// utilities/index.js
const invModel = require("../models/inventory-model");

// 1) Declara el objeto ANTES de usarlo
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

module.exports = Util;
