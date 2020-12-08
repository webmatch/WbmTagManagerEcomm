<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Core\Content\Property;

use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class PropertyEntity extends Entity
{
    use EntityIdTrait;

    /**
     * @var string
     */
    protected $module;

    /**
     * @var ?string
     */
    protected $parentId;

    /**
     * @var ?string
     */
    protected $afterId;

    /**
     * @var int
     */
    protected $childCount;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var ?string
     */
    protected $value;

    /**
     * @var bool
     */
    protected $onEvent = false;

    /**
     * @var string
     */
    protected $eventName = '';

    public function getModule(): string
    {
        return $this->module;
    }

    public function setModule(string $module): void
    {
        $this->module = $module;
    }

    public function getParentId(): ?string
    {
        return $this->parentId;
    }

    public function setParentId(?string $parentId): void
    {
        $this->parentId = $parentId;
    }

    public function getAfterId(): ?string
    {
        return $this->afterId;
    }

    public function setAfterId(?string $afterId): void
    {
        $this->afterId = $afterId;
    }

    public function getChildCount(): int
    {
        return $this->childCount;
    }

    public function setChildCount(int $childCount): void
    {
        $this->childCount = $childCount;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): void
    {
        $this->value = $value;
    }

    public function isOnEvent(): bool
    {
        return $this->onEvent;
    }

    public function setOnEvent(bool $onEvent): void
    {
        $this->onEvent = $onEvent;
    }

    public function getEventName(): string
    {
        return $this->eventName;
    }

    public function setEventName(string $eventName): void
    {
        $this->eventName = $eventName;
    }
}
