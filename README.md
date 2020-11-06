WbmTagManagerEcomm - GTM integration and dataLayer configuration
=====

This plugin integrates a new module within the [Shopware](https://www.shopware.de) backend that allows for the integration 
of the Google Tag Manager Snippet and the configuration of the dataLayer content.

The plugin offers the following features:

* Prepend the GTM Snippet to the head Tag of every page
* Define the content of the dataLayer for any route
* All variables passed to the view are available as values for the dataLayer properties
* Use Twig syntax to insert variables and alter values

Requirements
-----
* Shopware >= 6.0

Installation
====
Download it from the shopware store and install it manually within the shopware backend.

Alternative Installation via composer
```
composer require webmatch/tag-manager-sw6
```

After installation, use the following commands to install and activate the plugin in shopware
```
bin/console plugin:refresh
bin/console plugin install --activate WbmTagManagerEcomm
```

or the following to update, if previously installed
```
bin/console plugin:refresh
bin/console plugin:update WbmTagManagerEcomm 
```

##### :exclamation: Attention :exclamation:
With version 1.0.0 composer package was renamed from `wbm/tag-manager` to `webmatch/tag-manager-sw6` in order to publish the
package on packagist. If you used a version <= 0.2.5, and you want to update this plugin, your composer.json should be updated too.

Usage
=====
The module will be accessible in backend through a new menu point.

The plugin comes pre-configured for:
* Enhanced Ecommerce Tracking of Google Analytics
* Dynamic Remarketing of Google AdWords

Use syntax like `item in lineItems` as value for properties that are supposed to contain iterative elements.

Adding modules
=====
Modules are essentially configurations of a dataLayer for a specific view, meaning sites of more or less the same type.

When adding new modules you're prompted to enter a name (what the new tab will read) and a route for the module.

The route must be equal to the one of the controller action that is supposed to be tracked.

After adding a module you will find a new tab in the main screen, where you can declare the properties for the
dataLayer of that specific route.

Additional Twig functions/filters
=====

dbquery
-----

The Twig function `{{ dbquery(select, from, where, order) }}` is available for the compiling of dataLayers. The function allows you to fetch a single value
from any database table. You can pass one or multiple criterias to be used in `WHERE` and `ORDER BY` statements.

The following example will work in the dataLayer of the "Add to basket" module and will fetch the product number of the newly added product.

```
{{ dbquery('product_number', 'product', {'id =': item.id|uuid2bytes}) }}
```

Please note the use of single quotes only and the arguments in form of twig hashes e.g. `{'id =': item.id|uuid2bytes}`.

Also be aware that this feature is reliant on proper syntax, meaning you have to pass an operator with the column name and the 
columns as well as the values have to exist. Syntax errors will be caught and will result in an empty string to be returned instead.

uuid2bytes
-----

The Twig filter `|uuid2bytes` will convert uuid strings to binary format for the use in `dbquery` functions and the like.

```
{{ item.id|uuid2bytes }}
```

languageid
-----

Function that returns the current language id in binary format. For use in `dbquery` functions when fetching translations and the like.

```
{{ languageid }}
```

currencyiso
-----

Function that returns the 3 letter ISO code of the storefronts currency.

```
{{ currencyiso }}
```

cartaddprice
-----

Function that returns the unit price of a product when added to the basket in its current state.  
Expects parameters for product id in non-binary format, quantity, type (e.g. "product"), reference id, stackable & removable flags. (all as strings)  
Primarily for use in `addToBasket` events using form data as parameters.

```
{{ cartaddprice(item.id, item.quantity, item.type, item.referencedId, item.stackable, item.removable) }}
```

cartremoveprice
-----

Function that returns the unit price of a product when removed from the basket in its current state.  
Expects parameter for product id in non-binary format.  
Optionally takes a second boolean paramater and, when true, will return the quantity of the product before removal.
Primarily for use in `removeFrombasket` events using URL queries as parameters.

```
{{ cartremoveprice(product_id) }}
{{ cartremoveprice(product_id, true) }}
```

getvariantdescription
-----

Function that returns a concatenated string of properties for a product variant. Returns empty string if the product is not a variant.
Takes either a product id in non-binary format or an existing array of options.

```
{{ getvariantdescription(item.id) }}
{{ getvariantdescription(lineItem.payload.options) }}
```

getparam
-----

Function that returns a specific GET/POST/route parameter if available.

```
{{ getparam('id') }}
```
