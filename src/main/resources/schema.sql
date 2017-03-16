create table authority (
  id SERIAL primary key,
  name varchar(50));

create table users (
  id SERIAL primary key,
  first_name varchar(50),
  family_name varchar(50),
  e_mail varchar(50),
  phone varchar(50),
  language char(2),
  id_picture int,
  login varchar(50) NOT NULL UNIQUE,
  password varchar(50),
  burth_date Date,
  enabled boolean);

create table users_authority (
  id SERIAL primary key,
  id_user BIGINT,
  id_authority BIGINT);

create table token (
  series varchar(50) primary key,
  value varchar(50),
  date timestamp,
  ip_address varchar(50),
  user_agent varchar(200),
  user_login varchar(50));

CREATE TABLE LINK_DATA (
  id SERIAL PRIMARY KEY,
  fromm VARCHAR(30) NOT NULL,
  too VARCHAR(30) NOT NULL,
  color VARCHAR(10)
);

CREATE TABLE NODE_DATA(
  id SERIAL PRIMARY KEY,
  key VARCHAR(30) NOT NULL,
  category VARCHAR(50),
  pos VARCHAR(100) NOT NULL,
  text VARCHAR(255),
  angle INT
);

CREATE TABLE UPLOADED_FILES (
  id SERIAL PRIMARY KEY,
  fileName varchar(200) not null
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  image_name TEXT,
  img BYTEA
);