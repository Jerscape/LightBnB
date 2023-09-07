//postgres
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'NeonBeam79',
  host: 'localhost',
  database: 'lightbnb'
});

pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})


const properties = require("./json/properties.json");
const users = require("./json/users.json");



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  console.log("get user with email function", email)
  //const values = [`%${email}%`]
  return pool
    .query(`SELECT * FROM users 
    WHERE email=$1;`, [email])
    .then((result) => {
      console.log("result is: ", result.rows[0])
      return result.rows[0]
    })
    .catch((err) => {
      console.log(err.message)
    })

  // return pool 
  // .query(`SELECT * FROM properties LIMIT $1`, [limit])
  // .then((result) => {
  //   console.log(result.rows);
  //   return result.rows;
  // })
  // .catch((err) => {
  //   console.log(err.message);
  // });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  console.log("get user id function")
  return pool
  .query(`SELECT * FROM users
  WHERE id=$1;`, [id])
  .then((result) => {
    console.log("result from getuser id function: ",result)
    return result.rows[0]
    //return result[id]
  })
  .catch((err) => {
    console.log(err.message)
  })

  // return Promise.resolve(users[id]);
};


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function (user) {
  console.log("user passed to function:" , user)
  return pool
  .query(`INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *`, [user.name, user.email, user.password])
  .then((result)=> {
    return result.rows[0]
  })
  .catch((err) => {
    console.log(err.message)
  })
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  /*const limitedProperties = {};
  for (let i = 1; i <= limit; i++) {
    limitedProperties[i] = properties[i];
  }
  return Promise.resolve(limitedProperties);*/

  /*correct version from compass */
  return pool 
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
