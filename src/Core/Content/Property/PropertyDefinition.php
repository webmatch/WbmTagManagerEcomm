<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Core\Content\Property;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FkField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IntField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\LongTextField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class PropertyDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'wbm_data_layer_properties';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return PropertyEntity::class;
    }

    public function getCollectionClass(): string
    {
        return PropertyCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            (new StringField('module', 'module'))->addFlags(new Required()),
            (new FkField('parent_id', 'parentId', PropertyDefinition::class)),
            (new FkField('after_id', 'afterId', PropertyDefinition::class)),
            (new IntField('child_count', 'childCount')),
            (new StringField('name', 'name'))->addFlags(new Required()),
            (new LongTextField('value', 'value')),
        ]);
    }
}
