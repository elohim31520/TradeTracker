ALTER TABLE Statements ADD company VARCHAR(16);

select pe ,pb ,CAST(Forward_PE AS UNSIGNED) as FPE ,company from statements order by FPE desc;

select Market_Cap, pe ,pb ,Forward_PE ,company, createdAt from statements where company = "GOOG";