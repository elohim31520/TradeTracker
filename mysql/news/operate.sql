Select count(title) from news;

Select company ,count(title) from news group by company;

SELECT company ,title FROM news where title not REGEXP 'Right Now|why today|As Market Dips |Before Betting on It| To Buy Now |How Much You Would Have Today|What You Should Know';

Select company ,title from news where title like "%Earnings Call%";