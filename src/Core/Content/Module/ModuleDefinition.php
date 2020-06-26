<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Core\Content\Module;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class ModuleDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'wbm_data_layer_modules';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return ModuleEntity::class;
    }

    public function getCollectionClass(): string
    {
        return ModuleCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            (new StringField('name', 'name'))->addFlags(new Required()),
            (new StringField('module', 'module'))->addFlags(new Required()),
            (new StringField('response', 'response')),
        ]);
    }
}
