//RQUIRE postgres
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'NeonBeam79',
  host: 'localhost',
  database: 'lightbnb'
});

//LOAD UP AN INITIAL 10 PROPERTIES
pool.query(`SELECT title FROM properties LIMIT 10;`)

//REQUIRE STATEMENTS
const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { query } = require('express');


//GET USER WITH EMAIL
const getUserWithEmail = function (email) {
  
  
  return pool
    .query(`SELECT * FROM users 
    WHERE email=$1;`, [email])
    .then((result) => {
      return result.rows[0]
    })
    .catch((err) => {
      console.log(err.message)
    })
};

//GET USER WITH ID
const getUserWithId = function (id) {
  return pool
  .query(`SELECT * FROM users
  WHERE id=$1;`, [id])
  .then((result) => {
    return result.rows[0]
    //return result[id]
  })
  .catch((err) => {
    console.log(err.message)
  })

};

//ADD USER TO DATABASE
const addUser = function (user) {
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

};

// GET ALL RESERVATIONS
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
    return result.rows
  })
  .catch((err) => {
    console.log(err.message)
  })
  
};

/// GET ALL PROPERTIES 
const getAllProperties = function (options, limit = 10) {

  const queryParams = []

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_Reviews ON properties.id = property_id
  WHERE 1=1
  `;

  if(options.city){
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length} `;
  }

  //if a specific owner id is passed
  if(options.owner_id){
    queryParams.push(options.owner_id)
    queryString+= ` AND owner_id = $${queryParams.length}`
  }


  //IF MINIMUM OR/AND MAXIMUM PRICE IS PASSED
  if(options.minimum_price_per_night || options.maximum_price_per_night){

    //minimum price only
    if(options.minimum_price_per_night && !options.maximum_price_per_night){
      queryParams.push(100*(options.minimum_price_per_night))
      queryString+= ` AND cost_per_night > $${queryParams.length}`

    //maximum price only
    } else if (options.maximum_price_per_night && !options.minimum_price_per_night) {
      queryParams.push(100*(options.maximum_price_per_night))
      queryString+= ` AND cost_per_night < $${queryParams.length}`

    //both minimum and maximum price provided
    } else if (options.minimum_price_per_night && options.maximum_price_per_night) {
      queryParams.push(100*(options.minimum_price_per_night))
      queryParams.push(100*(options.maximum_price_per_night));
      let minPriceIndex = queryParams.length - 1;
      let maxPriceIndex = queryParams.length;
      queryString+= ` AND cost_per_night > $${minPriceIndex} AND cost_per_night < $${maxPriceIndex}`
    }
    
  }

  //IF MINIMUM RATING PASSED
  if(options.minimum_rating){
    queryParams.push(options.minimum_rating)
    queryString+= ` AND rating > $${queryParams.length} `

  }

  //ADD LIMIT
  queryParams.push(limit);
  queryString+= `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}`; 

  return pool.query(queryString, queryParams).then((res) => res.rows);

};

//ADD A NEW PROPERTY TO THE DATABASE
const addProperty = function (property) {
  
  return pool 
  .query(`INSERT INTO properties (
    owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces,
    number_of_bathrooms, number_of_bedrooms) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *`, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url,
  property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms,
  property.number_of_bedrooms])
  .then((result)=>{
    return result.rows[0] //?
  })
  .catch((err) => {
    console.log(err.message)
  })
  
};

//EXPORT FUNCTIONS
module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
