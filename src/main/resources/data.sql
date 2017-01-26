INSERT INTO users (first_name, family_name, login, password, e_mail, phone, language, enabled)
VALUES ('Danil', 'Turov', 'admin', 'admin', 'turovdanil@mail.ru', '89124999334', 'ru', TRUE);
INSERT INTO users (first_name, family_name, login, password, e_mail, phone, language, enabled)
VALUES ('User', 'User', 'user', 'user', 'user@mail.ru', '8564564', 'ru', TRUE);

INSERT INTO authority (name) VALUES ('admin');
INSERT INTO authority (name) VALUES ('technical user');
INSERT INTO authority (name) VALUES ('user');

INSERT INTO users_authority (id_user, id_authority) VALUES (1, 1);
INSERT INTO users_authority (id_user, id_authority) VALUES (1, 2);
INSERT INTO users_authority (id_user, id_authority) VALUES (1, 3);
INSERT INTO users_authority (id_user, id_authority) VALUES (2, 3);
INSERT INTO users_authority (id_user, id_authority) VALUES (3, 3);

-- INSERT INTO NODE_DATA (key, pos, text) VALUES ('P1', '0 0', 'Process');
-- INSERT INTO NODE_DATA (key, category, pos, text) VALUES ('P2', 'Process', '450 200', 'Tank');
-- INSERT INTO NODE_DATA (key, category, pos, text) VALUES ('V1', 'Valve', '150 0', 'V1');
-- INSERT INTO NODE_DATA (key, category, pos, text) VALUES ('P3', 'Process', '180 300', 'Pump');
-- INSERT INTO NODE_DATA (key, category, pos, text, angle) VALUES ('V2', 'Valve', '180 300', 'VM', 270);
-- INSERT INTO NODE_DATA (key, category, pos, text, angle) VALUES ('V3', 'Valve', '300 300', 'V2', 180);
-- INSERT INTO NODE_DATA (key, category, pos, text) VALUES ('P4', 'Process', '600 0', 'Reserve Tank');
-- INSERT INTO NODE_DATA (key, category, pos, text) VALUES ('V4', 'valveGateEntrance', '450 0', 'VA');
-- INSERT INTO NODE_DATA (key, category, pos, text, angle) VALUES ('V5', 'Valve', '600 160', 'VB', 90);
--
-- INSERT INTO LINK_DATA (fromm, too, color) VALUES ('P1', 'V1', '#e53935');
-- INSERT INTO LINK_DATA (fromm, too) VALUES ('P3', 'V2');
-- INSERT INTO LINK_DATA (fromm, too) VALUES ('V2', 'P1');
-- INSERT INTO LINK_DATA (fromm, too) VALUES ('P2', 'V3');
-- INSERT INTO LINK_DATA (fromm, too) VALUES ('V3', 'P3');
-- INSERT INTO LINK_DATA (fromm, too) VALUES ('P4', 'V5');
-- INSERT INTO LINK_DATA (fromm, too) VALUES ('V5', 'P2');
-- INSERT INTO LINK_DATA (fromm, too, color) VALUES ('V1', 'V4', '#e53935');
-- INSERT INTO LINK_DATA (fromm, too, color) VALUES ('V4', 'P4', '#e53935');
-- INSERT INTO LINK_DATA (fromm, too, color) VALUES ('V1', 'P2', '#e53935');




	