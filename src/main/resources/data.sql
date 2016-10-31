insert into users (first_name, family_name, login, password, e_mail, phone, language, enabled) values ('Danil', 'Turov', 'admin', 'admin', 'turovdanil@mail.ru', '89124999334', 'ru', true);
insert into users (first_name, family_name, login, password, e_mail, phone, language, enabled) values ('User', 'User', 'user', 'user', 'user@mail.ru', '8564564', 'ru', true);

insert into authority (name) values ('admin');
insert into authority (name) values ('technical user');
insert into authority (name) values ('user');

insert into users_authority (id_user, id_authority) values (1, 1);
insert into users_authority (id_user, id_authority) values (1, 2);
insert into users_authority (id_user, id_authority) values (1, 3);
insert into users_authority (id_user, id_authority) values (2, 3);
insert into users_authority (id_user, id_authority) values (3, 3);
	