UPDATE `wbm_data_layer_properties`
SET `value`= '{{ page.order.nestedLineItems.filterByType(\'promotion\')|map(item => item.label)|join(\', \') }}'
WHERE `module` = 'frontend.checkout.finish.page' AND `name` = 'coupon';
