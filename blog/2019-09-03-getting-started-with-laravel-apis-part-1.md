---
title: "Getting started with Laravel APIs Part 1: Tooling"
path: getting-started-with-laravel-apis-part-1
date: 2019-09-02
summary: In the words of a great guy, every man and his dog has an API. So, let us look how to build one quickly using Laravel.
tags: ['laravel', 'api', 'tutorial']
---

<!-- ![background](./images/max-nelson-taiuG8CPKAQ-unsplash.jpg) -->

In the words of a [great guy](https://philsturgeon.uk), every man and his dog has an API. So, let us look how to build one quickly using Laravel.

To start with, you need tools. You need to be able to design and test your API at multiple points during a build. There are many popular tools out there, some admittedly better than others, and everyone will have a preference. This isn't an article telling you which ones to use, it is simply telling you what I have found useful and what I use almost daily.

Every API you build will need designing, whether that is a quick sketch on a notepad, drawing things during a whiteboard session, or using software. I tend to use a little of everything when designing an API. I start with a concept in a notepad, which gets fleshed out further as it becomes a team effort and we move to whiteboards. At this stage we usually have a pretty solid idea of what we are trying to build.

I am a huge fan of REST (Representational state transfer) and use it heavily in most API's that I build. When building a REST API there are quite a few tools you can use to document our endpoints and manage our data models. For many years, in the PHP world at least, [swagger](https://swagger.io) was king. There were many approaches to using swagger, you could define your schema out in nice YAML files, or add extremely cumbersome code comments to generate documentation. These were the standard for many years.

I have recently fallen in love with a new tool called [Stoplight Studio](https://stoplight.io/studio/) which is a fantastic graphical user interface application wrapped around [OpenApi](https://www.openapis.org) standards. Since finding this tool I simply cannot go back. If you need a way to document and mock API's then this tool is for you.

We then move onto testing endpoints. Now [PHPStorm](https://www.jetbrains.com/phpstorm/) has a built in HTTP testing tool which for the average simple API being built is often good enough. I however didn't get on with the user interface, so ended up using [Postman](https://www.getpostman.com) for many years. While postman is a fantastic tool with many features that will make your life _soo_ much easier, I found the User Interface to be a little clunky to get along with at times. In the hunt to find something better for testing endpoints I came across [PAW](https://paw.cloud) and much like Stoplight Studio, once I started using it I couldn't turn back. This is what I like about finding good tools, once you find one that works for you; you stick with it.

This is simply an introduction to tooling when building API's, as with the right tools your job as a developer suddenly becomes *a lot* easier. Next time we will start by actually designing an API, and look at what might need to be done to make sure our API scales with our business.
