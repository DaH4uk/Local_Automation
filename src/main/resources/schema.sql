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

CREATE TABLE node_data
(
  id INTEGER DEFAULT nextval('node_data_id_seq'::regclass) PRIMARY KEY NOT NULL,
  key VARCHAR(30) NOT NULL,
  category VARCHAR(50),
  pos VARCHAR(100),
  text VARCHAR(255),
  angle INTEGER,
  scheme_id INTEGER,
  layer VARCHAR(30),
  CONSTRAINT node_data_schemes_id_fk FOREIGN KEY (scheme_id) REFERENCES schemes (id)
);
CREATE UNIQUE INDEX node_data_pkey ON public.node_data (id);


CREATE TABLE UPLOADED_FILES (
  id SERIAL PRIMARY KEY,
  fileName varchar(200) not null
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY NOT NULL,
  image_name TEXT,
  img BYTEA,
  scheme_id INT NOT NULL
);

CREATE TABLE schemes (
  id SERIAL PRIMARY KEY ,
  scheme_name TEXT
);