<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

final class Migration1609926925FixCouponOrderLineItems extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1609926925;
    }

    public function update(Connection $connection): void
    {
        $query = <<<SQL
            UPDATE `wbm_data_layer_properties`
            SET `value` = '{{ page.order.nestedLineItems.filterByType(\'promotion\')|map(item => item.label)|join(\', \') }}'
            WHERE `module` = 'frontend.checkout.finish.page' AND `name` = 'coupon';
SQL;

        $connection->exec($query);
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}
