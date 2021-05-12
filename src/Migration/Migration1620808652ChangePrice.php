<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1620808652ChangePrice extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1620808652;
    }

    public function update(Connection $connection): void
    {
        // use the "to" price, as that is more probably the price for 1 item as the "from" price
        $sql = "
            UPDATE wbm_data_layer_properties
            SET
                `value` = REPLACE(
                    `value`,
                    'product.calculatedListingPrice.from.unitPrice',
                    'product.calculatedListingPrice.to.unitPrice'
                )
                WHERE
                `value` LIKE '%product.calculatedListingPrice.from.unitPrice%';
        ";

        $connection->exec($sql);
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
