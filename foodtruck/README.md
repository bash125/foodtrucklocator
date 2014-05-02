Food Truck Locator
====================

A full-stack web application that finds food trucks near you. 
The [current site](http://salty-bastion-2252.herokuapp.com/) is hosted on Heroku.

The data is sourced from Yelp and plotted on Google Maps.

Technical Choices
--------------

I chose to write a full-stack application as I wanted full control over the data that I was receiving
and how I chose to present the data. I have long wanted to build a food truck locator and found this to be an
excuse to create what I've always wanted.

### Back-end

As the team primarily uses Python, I wanted to use a Python-based web framework. 
I used Django once a few years ago so I decided to pick it up again for this project.

Initially the back-end used Geodjango as I originally planned on using the City of San Francisco data
but feedback with beta users revealed that people wanted to see Yelp review data alongside
vendor data. Since Yelp provides coordinates of their vendors anyways, I removed the now-redundant geographic 
functionalities.

The back-end now simply queries Yelp's API and uses Tastypie to return the data in a REST-ful format. 
This made it very easy to integrate with Backbone.js.

### Front-end

As recommended, I uses Backbone.js and jQuery to retrieve and present the data on the front-end. This was
my first time using Backbone.js, and as such there was a significant time spent learning how to use it effectively.

In addition, I used Jasmine and Sinon for the first time to unit test my Backbone.js code. This process resulted 
in a significant refactoring of my original Backbone.js code to remove global variable dependencies 
as much as possible.

Technical Trade-offs
--------------

One consistent request among my beta users was the ability to quickly scan and eliminate food trucks based on 
categories. While I've added features to get closer to that goal such as a search box to find food trucks by name 
and adding category information to the info boxes for each food truck, I would implement this feature had I had
more time.

Other Projects
--------------

* [Amazon Realviews](https://github.com/bash125/AmazonRealviews) [(Github)](https://github.com/bash125/foodtrucklocator): 
A Chrome extension to weight Amazon reviews by the number of reviewers. Inspired by my frustrations 
shopping for bedding.

* [Zeta Psi Rush Toolbox](zptoolbox.herokuapp.com): A Ruby on Rails application to coordinate the rushing efforts 
of the Zeta Psi Fraternity. This centralized disparate data sources located in various spreadsheets onto one 
platform.

Resume
--------------
* Resume is linked [here](https://dl.dropboxusercontent.com/u/27880900/Kevin_Tse_CV_2014-04-23.pdf).