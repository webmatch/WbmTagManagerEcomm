<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1608034991FixSearchresultImpressions extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1608034991;
    }

    public function update(Connection $connection): void
    {
        $connection->exec('
            UPDATE `wbm_data_layer_properties`
               SET `value` = \'product in page.listing.elements\'
             WHERE `value` = \'product in page.searchResult\'
               AND `module` = \'frontend.search.page\'
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
