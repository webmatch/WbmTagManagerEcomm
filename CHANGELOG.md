# 2.1.4
* increase performance in admin
* fix cross selling clicks by harden js-condition

# 2.1.3
* add new store-api routes to import and export

# 2.1.2
* do not open product on add to cart button
* load product from DB for the case payload productNumber is not set or empty

# 2.1.1
* do not open product when SwagCmsExtensions quickview feature is activated

# 2.1.0
* refactor addtocart: use calculated price from shopware, instead of create a new cart and calculating it again.
The useless temporary carts will be deleted by migration.

# 2.0.1
* prevent splitting of impressions when "Push as separate event" is not explicit selected

# 2.0.0
* reduce response header
* use session as temporary storage instead of cookie
* split large impressions in order not to exceed the analytics limit of 8kb. To use this feature, you have
  to enable "Push as separate event" for the ecommerce subtree at "Home page", "Category page" & "Listing (ajax)".
  :exclamation: Attention, this is an expert option and may break functionality, especially if you are already using this checkbox.
  
# 1.6.0
* compatibility for SW 6.4

# 1.5.4
* compatibility to PHP 7.2

# 1.5.3
* remove control character before decoding to json

# 1.5.2
* add migration to correct unit prices for price ranges

# 1.5.1
* fix statements in migrations for SW<6.4

# 1.5.0
* fix statements in migrations
* move menuentry below marketing

# 1.4.4
* fix: do not handle promotions without accepted cookies

# 1.4.3
* fix product click

# 1.4.2
* prevent js-error according to missing js variable

# 1.4.1
* prevent error message when external consent isn't initialized

# 1.4.0
* add config option to remove script tags attribute for dataLayer

# 1.3.6
* rename itemprop `productNumber` to `sku`
* add area to promotionClick tracking

# 1.3.5
* Bugfix: correct typo in product click tracking

# 1.3.4
 * Bugfix: optimize value for coupon

# 1.3.3
 * Bugfix: fix option for product click tracking

# 1.3.2
 * Bugfix: add condition for empty impressions array

# 1.3.1
 * Bugfix: use window load as eventListener as it is the same as 'gtm.load'
 * Bugfix: correct undefined impressions in product click tracking

# 1.3.0
 * Feature: adding dutch snippetfiles (thx to @runelaenen)
 * Bugfix: correct value for impression on search pages

# 1.2.2
 * Bugfix: addToCart & removeFromCart now pushes event again

# 1.2.1
 * Bugfix: set default value for column eventname
 * Bugfix: use 'gtm.Load' for eventListener instead of DOMContentLoaded

# 1.2.0
 * Feature: possibility to send ecommerce values as separate event
 * Feature: default properties for coupon and payment method in option
 * Feature: add tracking of product clicks
 * Feature: add tracking of promotions and promotion clicks

# 1.1.3
 * Bugfix: 500 error when sales channel name is null
 * Bugfix: price is zero when basket isn't empty
 * Bugfix: possibility to decorate services (thx to @TimVroom)
 * Feature: extend script tag with user defined attributes
 
# 1.1.2
 * Bugfix: Get sales channel specific config

# 1.1.1
 * Add possibility to disable consent manager support

# 1.0.0
 * Breaking Change: rename composer package name

# 0.2.2
 * Bugfix: Set Google Tag Manager cookie lifetime to 90 days

# 0.2.1
 * Bugfix: ContainerId in head, thanks to Susanne Körber

# 0.2.0
 * Feature: Add consent manager support

# 0.1.2
 * Bugfix: Error in the shopping cart in connection with the `clone` command
