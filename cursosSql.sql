create database if not exists curso_online ;
use curso_online;

create table usuario(
gmail varchar(70) primary key not null,
senha varchar(16) not null
);



select * from usuario;