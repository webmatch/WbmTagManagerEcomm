<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1606378923ExtendProperties extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1606378923;
    }

    public function update(Connection $connection): void
    {
        $connection->executeQuery('ALTER TABLE `wbm_data_layer_properties`
            ADD COLUMN `on_event` TINYINT(1) NOT NULL DEFAULT 0;');
        // add some more default module properties
        $connection->executeQuery(file_get_contents(__DIR__ . '/properties.1606378923.sql'));
    }

    public function updateDestructive(Connection $connection): void
    {
        $connection->executeQuery('ALTER TABLE `wbm_data_layer_properties` DROP COLUMN `on_event`;');
    }
}
