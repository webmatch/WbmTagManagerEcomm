INSERT IGNORE INTO `wbm_data_layer_modules` (`id`, `name`, `module`, `response`, `created_at`, `updated_at`)
VALUES
	(X'218D1C5B3F4A404CA057C344F2E1278E','Cart Page','frontend.checkout.cart.page',NULL,'2019-11-13 12:14:14.170',NULL),
	(X'33C97A44159F4CA1B32E6FD04CC6A096','Remove From Cart','frontend.checkout.line-item.delete','frontend.cart.offcanvas,frontend.checkout.cart.page','2019-11-12 14:54:07.741',NULL),
	(X'3F6476E4F5E147B988C65F51E907B132','Product Detail','frontend.detail.page',NULL,'2019-10-30 12:19:17.444','2019-11-06 12:45:28.558'),
	(X'9537EA666ABB4FCFB89FFCDDE1A8B9B3','Confirm Page','frontend.checkout.confirm.page',NULL,'2019-11-13 12:46:49.736',NULL),
	(X'B4DFFC5665B845B1A70A3F1C9F62EC0D','Off-Canvas Cart','frontend.cart.offcanvas',NULL,'2019-11-13 11:47:02.492',NULL),
	(X'BE09CB10163443E2BDF5A613C9B3779E','Listing (ajax)','frontend.cms.navigation.page',NULL,'2019-12-13 09:21:10.205',NULL),
	(X'C57F9070628C4A15A694209DB1CFE411','Category Page','frontend.navigation.page',NULL,'2019-10-29 10:11:55.931','2019-12-13 09:21:23.110'),
	(X'C610DC07F4984196B0D98482F4C3AD56','Search Page','frontend.search.page',NULL,'2019-11-14 13:50:11.313',NULL),
	(X'E2EFC01C90F84E64BC4E09D4EA33757D','Finish Page','frontend.checkout.finish.page',NULL,'2019-11-14 13:08:14.593',NULL),
	(X'F411427A3E70404D880E342370B2741F','Checkout Register Page','frontend.checkout.register.page',NULL,'2020-01-16 17:50:26.893',NULL),
	(X'F73292ACF2BB4C14AA2AE8527C470D27','Home Page','frontend.home.page',NULL,'2019-11-14 15:02:59.628',NULL),
	(X'FAD73FD26AC64D86A5C4FA615879D613','Add To Cart','frontend.checkout.line-item.add','frontend.cart.offcanvas','2019-10-30 12:19:32.584','2019-10-31 19:17:23.990');
