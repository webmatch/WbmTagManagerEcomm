<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Core\Content\Property;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void                add(PropertyEntity $entity)
 * @method void                set(string $key, PropertyEntity $entity)
 * @method PropertyEntity[]    getIterator()
 * @method PropertyEntity[]    getElements()
 * @method PropertyEntity|null get(string $key)
 * @method PropertyEntity|null first()
 * @method PropertyEntity|null last()
 */
class PropertyCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return PropertyEntity::class;
    }
}
