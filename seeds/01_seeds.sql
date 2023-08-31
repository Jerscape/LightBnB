INSERT INTO users (name, email, password)
VALUES ('Jeeves Dutton', 'jdutton@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
('Dayna DeBenedt', 'dd@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
('Ooompa Loompa', 'oompa@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' );

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg' , 936771,  6,  4,  8,  'Canada' ,  'Namsub Highway' , 'Sotboske' , 'Quebec' , 28142, True),
(1, 'speedUMP' ,  'description' ,  'https://images.pexels.com/photos/2086678/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086636/pexels-photo-2086676.jpeg' , 935661,  7 ,  12,  2,  'Canada' ,  'Lum Rd', 'Juniper' , 'Ontario' ,  28442 , True),
(1, 'mango chair',  'description',  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg' , 930671,  6 ,  4,  8,  'Canada' , 'Namsub Highway' , 'Sotboske' , 'Quebec', 28142 ,  True);


INSERT INTO reservations (start_date, end_date)
VALUES ('2018-08-11', '2018-08-26'),
('2018-05-11', '2018-05-14'),
('2018-03-17', '2018-03-21');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 2, 1, 5, 'message mcmessageface'),
(2, 2, 2, 5, 'message mcmessageface'),
(3, 1, 3, 5, 'message mcmessageface');