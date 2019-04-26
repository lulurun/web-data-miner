The web-data-minier is aiming to build a general web scraper.

It can detect if a web page contains listing data (like google search result) or a single data (like a wikipedia article) and exrtact data automatically.

It is written in pure javascript with no dependencies, and the algorithm can be easily implemented in any language.


To be continued ...

<!--
/* Example of the calculation

update(/a/b/)
update(/a/b/c/d/e)
update(/a/b/c/d/f)
update(/a/b/c)
update(/a/g)
update(/a/g/h/i)
update(/a/g/h/i/k/l)
update(/a/g/h/i/k)
update(/a/g/h/j)

=> calculate score for each element
 (using ACCUMULATED_PRIMES)

/a/b
  cnt = 4
  depth = *2*
  weight = (2 + 3) sum of first *2* primes
  score = cnt * weight               = 20
/a/b/c cnt=3 * weight=(2 + 3 + 5)    = 30
/a/b/c/d 2 * (2 + 3 + 5 + 7)         = 34
/a/b/c/d/e 1 * (2 + 3 + 5 + 7 + 11)  = 28
/a/b/c/d/f 1 * (2 + 3 + 5 + 7 + 11)  = 28
/a/g 5 * (2 + 3)                           = 25
/a/g/h 4 * (2 + 3 + 5)                     = 40
/a/g/h/i 3 * (2 + 3 + 5 + 7)               = 51
/a/g/h/i/k 2 * (2 + 3 + 5 + 7 + 11)        = 56
/a/g/h/i/k/l 1 * (2 + 3 + 5 + 7 + 11 + 13) = 41
/a/g/h/j 1 * (2 + 3 + 5 + 7)               = 17

*/
-->