CREATE DATABASE IF NOT EXISTS gestion_salles_tp_physique;
USE gestion_salles_tp_physique;

CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'pass';
GRANT ALL PRIVILEGES ON gestion_salles_tp_physique.* TO 'user'@'%';

create table personne (id integer not null auto_increment, adresse varchar(255), cin varchar(20) not null, code_postal varchar(10), date_naissance date not null, email varchar(150) not null, grade enum ('INGENIEUR','PROFESSEUR','TECHNICIEN') not null, mot_de_passe varchar(255) not null, nom varchar(100) not null, nom_banque varchar(100), numero_som varchar(7) not null, prenom varchar(100) not null, responsabilite enum ('ADJOINT_CHEF_DEPARTEMENT','ADMINISTRATEUR','CHEF_DEPARTEMENT','DIRECTEUR_LABORATOIRE','UTILISATEUR') not null, telephone varchar(20) not null, ville varchar(100), primary key (id));

INSERT INTO personne (
    adresse, cin, code_postal, date_naissance, email, grade, 
    mot_de_passe, nom, nom_banque, numero_som, prenom, responsabilite, 
    telephone, ville
) 
VALUES (
    'lazaret', 'A123456', '60000', '1980-05-10', 'ali.berkani@example.com', 
    'PROFESSEUR', '$2a$10$42dLDMB73Vz5aX.YulCf9.89sp6iSZiRReV/eabsQ49AhyS7DpQ.a', 
    'Berkani', 'BMCE', '1234567', 'Ali', 'ADMINISTRATEUR', 
    '0612345678', 'oujda'
);
