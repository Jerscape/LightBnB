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
const { query } = require('express');



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
  
  return pool
  .query(`SELECT reservations.*, properties.title, properties.number_of_bedrooms, properties.number_of_bathrooms,
  reservations.start_date, reservations.end_date, properties.cost_per_night, avg(rating) as average_rating,
  properties.thumbnail_photo_url
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id=$1
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2
  `, [guest_id, limit])
  .then((result)=> {
    console.log("resultA: ", result.rows)
    return result.rows
  })
  .catch((err) => {
    console.log(err.message)
  })
  
  //return getAllProperties(null, 2);
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

  const queryParams = []

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_Reviews ON properties.id = property_id
  `;

  if(options.city){
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }


  //if a specific owner id is passed
  if(options.owner_id){
    //push ownerid onto query params
    queryParams.push(`${options.owner_id}`)
    queryString+= `AND owner_id =$${queryParams.length}`
  }

  console.log("logging options: ", options)
  console.log("logging query params:", queryParams)

  //if min and max price passed
  if(options.minimum_price_per_night || options.maximum_price_per_night){
    if(options.minimum_price_per_night && !options.maximum_price_per_night){
      queryParams.push(`${options.minimum_price_per_night}`)
      queryParams+= `AND $${queryParams.length}`

    } else if (options.maximum_price_per_night && !options.minimum_price_per_night) {
      queryParams.push(`${options.maximum_price_per_night}`)
      queryString+= `AND $${queryParams.length}`

    } else if (options.minimum_price_per_night && options.maximum_price_per_night) {
      queryParams.push(`${options.minimum_price_per_night}`)
      let minPriceIndex = queryParams.length;
      queryParams.push(`${options.maximum_price_per_night}`);
      let maxPriceIndex = queryParams.length;
      queryString+= `AND $${properties.cost_per_night} >= $${minPriceIndex} AND properties.cost_per_night <= $${maxPriceIndex})`
    }
    
  }

  if(options.minimum_rating){
    queryParams.push(`${options.minimum_rating}`)
    queryString+= `AND $${queryParams.length}`

  }

  console.log("logging query params:", queryParams)

  queryParams.push(limit);
  queryString+= `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}`; //END OF QUERY STRING WITH SEMICOLON

  console.log(queryString, queryParams)

  return pool.query(queryString, queryParams).then((res) => res.rows);

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
