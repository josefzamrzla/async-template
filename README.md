# Async template directive

AngularJS directive to load both JSON data and template asynchronously to a page

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

