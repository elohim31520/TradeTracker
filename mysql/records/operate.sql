INSERT INTO records (id ,userId ,share ,price ,porfit_percent ,total ,company ,open_time)
VALUES (1 ,"70eq6c1wvsf" ,5 ,6.6 ,7.7 ,"2%" ,50 ,"XOM" ,"2022-11-10");

Select * from records group by company;

select SUM(total) as total_account from records where userId = "lewis.lee";