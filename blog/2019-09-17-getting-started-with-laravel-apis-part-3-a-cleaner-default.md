---
title: "Getting started with Laravel APIs Part 3: A cleaner default"
path: getting-started-with-laravel-apis-part-3-a-cleaner-default
date: 2019-09-17
summary: The default installation of Laravel is aimed at a typical web application, which is a great entry for most people - however, when building an API things need to be changed slightly.
tags: ['laravel', 'api', 'tutorial']
---

![laravel logo](./images/laravel-logo.png)

The default installation of Laravel is aimed at a typical web application, which is a great entry for most people. However, when building an API things need to be changed slightly.

The directory structure for Laravel is pretty easy to understand, and is setup for you to get going pretty quickly. The main problem I have found is that when you application grows the directory structure starts to get difficult to navigate and you end up with brain overload trying to find things without a good IDE.

## Operation Cleanup

Some people prefer to use Lumen when it comes to building APIs. However, I am not one of them. Lumen is a very trimmed down version of Laravel with a different target - no make generators by default etc etc. We use Laravel because it is fast to get something working and the fluent syntax makes things easy to understand as we go.

Creating a cleaner default isn't too difficult, but you have to make sure you are methodical about how you approach it. It is easy to forget something, so you want to make sure you go front to back. I start with where our users would enter our application: `Routing`. The first step is to remove that `routes/web.php` file as it is not going to be needed. This will, however, break a few of things.

This is our first real refactor now, we need to refactor the `app/Providers/RouteServiceProvider.php` file and remove the loading of web routes. I typically do this in a particular way, I remove the calling of the `mapWebRoutes()` function and rename the api loading function like the below:

```php
<?php

public function map()
{
    $this->mapV1Routes();
}

protected function mapApiV1Routes()
{
    Route::prefix('v1')
        ->middleware('api')
        ->namespace("$this->namespace\\V1")
        ->group(base_path('routes/api/v1.php'));
}
```

As you can see a few things have changed. We are now mapping only the API V1 routes, which we prefix straight away with `v1`, we no longer have web routes so we do not need the `api` prefix. We then need to add version namespacing to these routes, to allow us to migrate users between versions, and we also move the `routes/api.php` file into a versioned approach also, so ensure to remove `routes/api.php`.

This is the first step I do with *any* Laravel API, it allows us to clean how we organise routing as well as add in some versioning. Ensure you create a `routes/api/v1.php` file and add the following:

```php
<?php

Route::get('/ping', function () {
    return response()->json([
        'ack' => time()
    ]);
});
```

This is a great little test route to add, a simple ping to ensure that systems are online - from this point onwards its an application error. 

Our next step, let's remove the `web` middleware from `app/Http/Kernel.php` as it won't be called:

```php
<?php

protected $middlewareGroups = [
    'api' => [
        'throttle:60,1',
        'bindings',
    ],
];
```

At this stage you can also remove the following files/directories as we won't be using any front end:

- `package.json`
- `webpack.mix.js`
- `resources/js`
- `resources/sass`
- `resources/views/welcome.blade.php`

I typically keep hold of the views directory to hold onto any transactional emails you may need. This is now a relatively clean install of Laravel, and doesn't have any web technologies that are not going to be utilised.

## Reorganising the APP directory

Once I have a clean base to work upon, I turn my attention onto the `app` directory. So by default we have the following contents inside the app directory:

```bash
app/
    Console/
    Exceptions/
    Http/
    Providers/
    User.php
```

For your average project which isn't going to extend much this is most likely ok. However, I make a couple of key changes to ensure I can separate things logically.

The first step, move all core functionality provided by Laravel into a `Core` directory:

```bash
app/
    Core/
        Console/
        Exceptions/
        Http/
        Providers/
```

To make sure your application still works we need to refactor a few files. All of the files we moved into this `Core` directory will require some namespace changes to reflect the `Core` namespace as well as any classes being imported. Following on from this we will need to change how things are loaded in the following files:

- `bootstrap/app.php`
- `config/app.php`

So this leaves us with one floating file in the `app` directory, our `User.php` file. In the next section I will walk through how we want to handle these Models which define our logic.

## Handling our business logic

![business logic](./images/analytics.svg)

Up until now we have been simply moving and refactoring files to get Laravel into a state where we are happy with it. Next we move onto how we are going to organise more specific code in our business logic. We will organise these under `Domains` however, I want to stress that we *are not following Domain Driven Design* in this article.

Our first step, let us create our User Domain:

```bash
app/
    Core/
    Domains/
        User/
            Models/
                User.php
```

So ensure you move namespace over to `namespace App\Domains\User\Models` within your User Model, also ensure to make the following change in your `config/auth.php`:

```php
<?php

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Domains\User\Models\User::class,
    ],
],
```

We have now moved our default `User` Model over, it is now time to flesh out how we want some interaction to work.

One of the most common things I find people failing with in Laravel when it comes to scaling, is that they start having to replicate business logic. Their controllers end up holding all of the logic, making it difficult to expand upon. For quite awhile now I have been using simple classes which I can use to encapsulate this business logic, and action it from any interface be that Http or command line. This is something that is getting a little more popular now thanks to other people also following this pattrn. These are classes that are actionable, similar to Laravel Jobs that can be dispatched. Here is an example one below:

```php
<?php

namespace App\Domains\User\Actions;

use App\Domains\User\Models\User;

class CreateUserAction
{
    public function handle(array $data): User
    {
        return User::create($data);
    }
}
```

Now this is a nice and simple implementation of what could be done, it is a class that performs a simple task when asked to be handled. How would we implement this from a Controller?

```php
<?php

namespace App\Domains\User\Http\Controllers;

use App\Domains\User\Actions\CreateUserAction;
use App\Domains\User\Http\Requests\StoreRequest;

class StoreController
{
    protected $action;

    public function __construct(CreateUserAction $action)
    {
        $this->action = $action;
    }

    public function __invoke(StoreRequest $request)
    {
        // any authorisation

        $user = $this->action->handle($request->all());

        // return here
    }
}
```

Let us step through what is going on here. Firstly we have our constructor - which using Laravel container we can automatically wire up the action we wish to be able to use. We set this action as a protected property so that we can access it later on. We invoke our controller class, which has the request injected from the container: however, this request is a Laravel Form Request which will handle the basic authorisation for us as well as the validation. We then ask the injected action to perform the handle method passing through the request data which in turn allows our action to return a newly created user.


## In conclusion

So far in this series we have gone through some great tools which we can use to design our API, we have broken down some requirements so that we know what our data models are going to look like. Now we have just created a cleaner default Laravel installation allowing us to scale where needed and split things up into logical "domains". In the next article we will go through mapping our business requirements into Laravel Models so that we can expand out business logic before moving onto testing our API and the different ways in which we can and probably should approach testing modern applications.
