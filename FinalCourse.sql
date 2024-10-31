create database if not exists FinalCourse ;
use FinalCourse;

create table users(
	userCPF varchar(11) not null,
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
    Foreign Key (userEmail_FK) references users (userEmail) on delete cascade,
    Foreign Key (courseID_FK) references courses (courseID) on delete cascade
);

create table comments(
	commentID int not null auto_increment,
    courseID_FK int not null,
    userEmail_FK varchar(255) not null,
    userComment text not null,
    
    Primary Key(commentID),
    Foreign Key (courseID_FK) references courses (courseID) on delete cascade,
    Foreign Key (userEmail_FK) references users (userEmail) on delete cascade
);

create table videos(
	videoLink varchar(255) not null,
    courseID_FK int not null,
    
    Primary Key(videoLink),
    Foreign Key (courseID_FK) references courses (courseID)
);

insert into videos values ("https://www.youtube.com/embed/vFzRi3wGfI8?si=V4MN8jJKJAjbbzsn", 1), ("https://www.youtube.com/embed/boUA0S628hY?si=AWCtl7WmG3037PMA", 1), 
("https://www.youtube.com/embed/QnymMxXFsmY?si=zqqVYrozZHthNBUq", 1), ("https://www.youtube.com/embed/kfcqmr6fbZk?si=or8YLrah2wQWnvzd", 1),
("https://www.youtube.com/embed/f4IYQb7z2Ww?si=BaTSIyiZZ9iAstsh", 1),
("https://www.youtube.com/embed/VfIXgGJWLvA?si=hUYv8s2VavoyRYRK", 2), ("https://www.youtube.com/embed/57wyfS560Uk?si=M88fKAt4xJ8-Tkpu", 2), 
( "https://www.youtube.com/embed/0zLjVhHdOm8?si=c461BHUpfK6cnzGW", 2), ("https://www.youtube.com/embed/F74GKCLXUWM?si=dVC-jeRxCadbnmgc", 2), 
("https://www.youtube.com/embed/nlO5hySqJFA?si=EEtt9r7YnjqO0fVt", 2), ("https://www.youtube.com/embed/RFHSt1PCy0k?si=dd41VEOtdwlblhR6", 2), 
( "https://www.youtube.com/embed/B4FU3NFRTDw?si=qC_hX7YRPYZTFjN0", 2), ("https://www.youtube.com/embed/iSqf2iPqJNM?si=XWOIbZ5xPhxH9BoN", 2), 
("https://www.youtube.com/embed/UForX7ehChM?si=DO9h_ebo3kMacYhv", 2), ("https://www.youtube.com/embed/E6CdIawPTh0?si=hEtca15ieZYDsFvI", 2), 
("https://www.youtube.com/embed/f6NTJdtEFOc?si=f5eikLHoQMbLaJmB", 2), ("https://www.youtube.com/embed/nhMdFe3WwYc?si=cBwJZXPRFI1UZp0C", 2), 
("https://www.youtube.com/embed/bDULqeGEvAw?si=nn_B6_1h5ymp_tQ3", 2), ("https://www.youtube.com/embed/xg-vHgLF0mI?si=YP12Sv2MQxjmW6LA", 2), 
("https://www.youtube.com/embed/8rkuukKA8a4?si=DjLTDmtwtG5Mo7eE", 2), ("https://www.youtube.com/embed/CwOmEetWMnU?si=xsaZFuHbIwk8gfSg", 2), 
("https://www.youtube.com/embed/1ZeettFfxys?si=AkY2NmiQ3zOj8bkW", 2), ("https://www.youtube.com/embed/aiOEBhozEOg?si=kl_Bt9oPSXf0_GnH", 2), 
("https://www.youtube.com/embed/HaSgt1hK2Fs?si=ldsZ_4Z1Pg1jUY0O", 2), ("https://www.youtube.com/embed/T-d_hsO3hUI?si=c-t430k6HfpsM_8X", 2),
("https://www.youtube.com/embed/uzEhd3Lugik?si=UT2oRZhD5QNlatCq", 3),
("https://www.youtube.com/embed/Ptbk2af68e8?si=YOqBdOX6nBOWW7xN", 3),
("https://www.youtube.com/embed/rUTKomc2gG8?si=ryy_V6v3dc1qvAKE", 3),
("https://www.youtube.com/embed/FdePtO5JSd0?si=Cczyyo6K9KF_qx82", 3),
("https://www.youtube.com/embed/OmmJBfcMJA8?si=vrsZpna_9dmNqeFO", 3),
("https://www.youtube.com/embed/FjT97HVT5g8?si=Nh1qnodC8Rhg3l0o", 3),
("https://www.youtube.com/embed/Vbabsye7mWo?si=DS40zw7ZWdcSGjWq", 3),
("https://www.youtube.com/embed/OJgu_KCCUSY?si=-ntswZ483gKR61xf", 3),
("https://www.youtube.com/embed/hZG9ODUdxHo?si=cOnREfoPCnQ6oIpF", 3),
("https://www.youtube.com/embed/BP63NhITvao?si=vMDSarKnOcN-RiQF", 3),
("https://www.youtube.com/embed/H80nCKs9c2k?si=3_OYcU2uI-LAhJg-", 3),
("https://www.youtube.com/embed/WWZX8RWLxIk?si=i27r2LYxrvIp-_Fb", 3),
("https://www.youtube.com/embed/wWnBB-mZIvY?si=UOpaOzy9boBQAalt", 3),
("https://www.youtube.com/embed/uPFasdmZHJc?si=JCuxzEACGH-C_UL6", 3),
("https://www.youtube.com/embed/cOdG4eACN2A?si=bvoCFupqFNntaZUz", 3),
("https://www.youtube.com/embed/EEStcIe8rAM?si=b-r6POMwdWIs1tnF", 3),
("https://www.youtube.com/embed/3emz6rpcJyA?si=H4JX7FAVoL4oq5YM", 3),
("https://www.youtube.com/embed/5rZqYPKIwkY?si=0gcjaTg9aQUz2jhF", 3),
("https://www.youtube.com/embed/eX-lkN_Zahc?si=bh4V2r206pvOhz1p", 3),
("https://www.youtube.com/embed/5m4UhZd-Les?si=jb24EuQJXK5Wl2-l", 3);

create table watchedVideos(
	videoLink_FK varchar(255) not null,
    courseID_FK int not null,
    userEmail_FK varchar(255) not null,
    isWatched boolean not null,
    
    Foreign Key (videoLink_FK) references videos (videoLink) on delete cascade,
    Foreign Key (courseID_FK) references courses (courseID) on delete cascade,
    Foreign Key (userEmail_FK) references users (userEmail) on delete cascade
);

create table videoFeedback(
	feedbackID int not null auto_increment,
	videoLink_FK varchar(255) not null,
    courseID_FK int not null,
    userEmail_FK varchar(255) not null,
    feedback boolean not null,
    
    Primary Key(feedbackID),
    Foreign Key (videoLink_FK) references videos (videoLink) on delete cascade,
    Foreign Key (courseID_FK) references courses (courseID) on delete cascade,
    Foreign Key (userEmail_FK) references users (userEmail) on delete cascade
);


select * from users;
select * from courses;
select * from courseUsers;
select * from comments;
select * from videos order by courseID_FK;
select * from watchedVideos;

select courseName from courseUsers inner join courses on courseID_FK = courseID and userEmail_FK = "asd@gmail.com";
select sum(wv.isWatched)*100/c.modulesAmount from watchedVideos wv inner join courses c where wv.courseID_FK = c.courseID  and wv.courseID_FK = 1 and userEmail_FK = "asd@gmail.com" group by courseID;