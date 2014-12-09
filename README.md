Portfolio-Site
==============

What first started out as a simple site that used Angular just to switch panels, turned into the Javascript problem-solving olympics for me.  Every time you refresh the my site you will see the quicksort algorithm unfold in a different way (unless you watch it a lot of times or have terrible luck) with varying effect.  The standard quicksort algorithm is recursive, so getting that to happen with delay in javascript meant using setInterval() and looping through a bunch of things.  Luckily for me I was using Angular and the entire process happens by manipulating objects in a nested arrays that I have the DOM tied to by using ng-repeat!  Even though it made my life easier for the most part, I still ended up with some crazy problems to get through.  For instance the process for setting all the objects to pivot on after the first one is done with this function:
###So much going on just to make some new letters turn big or red! (Okay that's just part of the case but still all the user really sees happening)
![pivots](http://i.imgur.com/e5sdvsL.jpg)
Simple things are sometimes the best to show off, so if that function was annoying and complicated here's a nice little array shuffler I had to implement in order to shuffle the letters around at the start:
###Loop from the back of an array if you want to chop it up!
![Imgur](http://i.imgur.com/sXmqjYh.jpg)

For the design of the website I decided I was going to make a sleek black and white theme, and I feel it really makes the home page cool!  I did use the ever so popular vertical bar approach to the project tab, just I dont not have generic colored background colors.  Instead the image borders and icons of the tecnologies I used are highlighted by being in color!  You can use the link on my site to email me if you request a version of my portfolio site that looks like everybody elses web page, and I will happily oblige and enter 4 lines of css code for you :) (sacrificing all style creativity I had).  Speaking of links, all of them open in a new tab like they are supposed to!
