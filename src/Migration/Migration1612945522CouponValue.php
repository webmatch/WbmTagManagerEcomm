<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1612945522CouponValue extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1612945522;
    }

    public function update(Connection $connection): void
    {
        $sql = "
            UPDATE `wbm_data_layer_properties`
               SET `value` = '{% set promotions = \'\' %}{% for lineItem in page.cart.lineItems.elements|filter(lineItem => lineItem.type == \'promotion\') -%}{% set promotions = promotions ~ lineItem.payload.code %}{% if not loop.last %}{% set promotions = promotions ~ \',\' %}{% endif %}{% endfor %}{{ promotions }}'
             WHERE `name` = 'coupon'
               AND `value` = '{% set promotions = \'\' %}{% for lineItem in page.cart.data.get(\'promotions\') %}{% set promotions = promotions ~ lineItem.payload.code %}{% if not loop.last %}{% set promotions = promotions ~ \',\' %}{% endif %}{% endfor %}{{ promotions }}'
        ";

        $connection->executeStatement($sql);
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
