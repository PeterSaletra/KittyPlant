create table users(user_id int not null primary key , username varchar(30), mail varchar(30), password varchar(20));
create table plants(plant_id int not null primary key , name varchar(30), min_hyd_level int, max_hyd_level int);
create table devices(device_id int not null primary key , plant_id int, foreign key (plant_id) references plants(plant_id));
create table data(data_id int not null primary key , device_id int, data_value int, foreign key (device_id) references devices(device_id));
create table relations(relation_id int not null primary key, device_id int, user_id int, foreign key (device_id) references devices(device_id), foreign key (user_id) references users(user_id));
INSERT INTO plants (plant_id, name, min_hyd_level, max_hyd_level) VALUES
    (1, 'Alokazja', 40, 65),
    (2, 'Aloes Zwyczajny', 5, 20),
    (3, 'Chamedora Wytworna', 35, 60),
    (4, 'Figowiec Dębolistny', 45, 70),
    (5, 'Figowiec Sprężysty', 30, 55),
    (6, 'Haworsja', 15, 40),
    (7, 'Monstera Dziurawa', 30, 55),
    (8, 'Monstera Perforowana', 30, 55),
    (9, 'Sansewieria Gwinejska', 5, 25),
    (10, 'Skrzydłokwiat', 50, 75),
    (11, 'Zamiokulkas Zamiolistny', 10, 30),
    (12, 'Begonia Koralowa', 35, 60);
