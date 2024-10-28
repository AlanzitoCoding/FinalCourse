create database FinalCourse;
use FinalCourse;

create table users(
	userCPF int not null,
    userName varchar(255) not null,
	userEmail varchar(255) not null,
    userPassword varchar(255) not null,
    userPhone int not null,
    
    Primary Key(userEmail)
);

create table courses(
	courseID int not null auto_increment,
    courseName varchar(255) not null,
    modulesAmount int not null,
    
    Primary Key(courseID)
);

insert into courses (courseName, modulesAmount) values ("GitHub", 5), ("HTML e CSS", 20), ("JS", 20);

create table courseUsers(
	cousID int not null auto_increment,
    userEmail_FK varchar(255) not null,
    courseID_FK int not null,
    
    Primary Key(cousID),
    Foreign Key (userEmail_FK) references users (userEmail),
    Foreign Key (courseID_FK) references courses (courseID)
);

select * from users;
select * from courses;
select * from courseUsers;