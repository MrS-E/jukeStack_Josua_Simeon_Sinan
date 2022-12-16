/*
createTables_jukeStack
This script creates 3 tables, TUsers which includes the data of the user, 
TLendings which includes all data of the landing process and
TNFTSongs which inclueds all data of the Songs which can be lend.

Author: Josua Panzera
Date: 2022-12-13

History:
Version	Date		Who	Changes
1.0  	2022-12-13	JP	created

Copyright ©2022 Josua Panzera
*/
use jukeStackDB_SimeonSinanJosua;
-- Table TUsers
create  table if not exists TUsers (
	UsMail varchar(45) not null primary key,
    UsSalutation enum('Sir', 'Madam') not null,
    UsFName varchar(45) not null,
    UsSName varchar(45) not null,
    UsPasswd char(64) not null
);
-- Table TLendings
create table if not exists TLendings (
	LenId int unsigned auto_increment not null primary key,
    LenStart timestamp not null,
    LenEnd timestamp,
    NFToken char(16) not null,
    UsMail varchar(55) not null
)auto_increment = 1000000;
-- Table TNFTSongs
create table if not exists TNFTSongs (
	NFToken char(16) not null,
    NFInterpret varchar(45),
    NFName varchar(80) not null,
    NFLength time not null,
    NFYear char(4)
);

