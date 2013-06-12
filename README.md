# Async template directive

AngularJS directive to load both JSON data from remote endpoint and template asynchronously to a page.

I'm hardly working on some example :-)

## Installation

Simply attach JS file to your page and add 'asyncTemplateModule' module as a dependency

```javascript
var app = angular.module('asyncTplTest', ['asyncTemplateModule']);
```

... and use it in your templates

```html
<async-template endpoint="/api/some_endpoint" template="templates/template.html" />
```


## Usage

Directive parameters

* endpoint - JSON endpoint (API) URL. REQUIRED.
* template - template URL (should be local, directive uses HTTP GET only to load template). REQUIRED.
* error-template - template which is loaded when loading data from endpoint fails.
* jsonp - boolean switch whether use JSONP method instead of simple HTTP GET.
* is-array - boolean switch whether data returned by endpoint should be parsed as array.
* reload-interval - load data periodically in some interval in miliseconds.
* observe - observe only manually defined list of directive attributes. Directive observes all attributes by default.


# Load data using HTTP GET, no endpoint params

Simply loads JSON data from endpoint using HTTP GET method, loads template and compiles it with data

```html
<async-template endpoint="/api/some_endpoint" template="templates/template.html" />
```

# Load data using JSONP, no endpoint params

Simply loads JSON data from endpoint using JSONP method, loads template and compiles it with data

```html
<async-template endpoint="/api/some_endpoint" template="templates/template.html" jsonp="true" error-template="templates/404.html" />
```

# Load data with fixed params

```html
<async-template endpoint="/api/user/:userId/info" template="templates/template.html" userId="1" />
```

# Load data with params binded to application scope

Loads data from endpoint, user ID is taken from app scope - method getUserId(). Directive observes this parameter,
so when it's value changes, it reloads appropriate data.

```html
<async-template endpoint="/api/user/:userId/info" template="templates/template.html" userId="{{getUserId()}}" />
```

# Load data periodically every 1 second

```html
<async-template endpoint="/api/user/:userId/info" template="templates/template.html" userId="1" reload-interval="1000" />
```