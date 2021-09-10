<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1631192197DeleteTemporaryCarts extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1631192197;
    }

    public function update(Connection $connection): void
    {
        // remove temporary carts created by this plugin
        $connection->exec('
            DELETE FROM cart WHERE token LIKE \'temporaryToken.%\';
        ');
        $connection->exec('
            UPDATE wbm_data_layer_properties
            SET `value` = \'{{ cartaddprice() }}\'
            WHERE value LIKE \'{{ cartaddprice(%\';
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
