<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1607952506EventnameDefault extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1607952506;
    }

    public function update(Connection $connection): void
    {
        $connection->exec(
            'ALTER TABLE wbm_data_layer_properties ALTER COLUMN event_name SET DEFAULT \'\';'
        );
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
