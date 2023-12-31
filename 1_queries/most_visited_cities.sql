
/*my code*/
SELECT count(reservations.*) as total_reservations, city
FROM reservations 
JOIN properties ON reservations.property_id = properties.id
GROUP BY city
ORDER BY total_reservations DESC;


/* "correct answer" */
SELECT properties.city, count(reservations) as total_reservations
FROM reservations
JOIN properties ON property_id = properties.id
GROUP BY properties.city
ORDER BY total_reservations DESC;