<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Cookie;

use Shopware\Core\System\SystemConfig\SystemConfigService;
use Shopware\Storefront\Framework\Cookie\CookieProviderInterface;

class CustomCookieProvider implements CookieProviderInterface
{
    public const WBM_GTM_ENABLED_COOKIE_NAME = 'wbm-tagmanager-enabled';

    private const WBM_GTM_ENABLED_COOKIE_DATA = [
        'snippet_name' => 'wbmTagManager.cookie.groupStatisticalTagmanager',
        'cookie' => self::WBM_GTM_ENABLED_COOKIE_NAME,
        'value' => '1',
        'expiration' => '90',
    ];

    private const WBM_GTM_COOKIE_GROUP_DATA = [
        'snippet_name' => 'wbmTagManager.cookie.groupStatistical',
        'snippet_description' => 'wbmTagManager.cookie.groupStatisticalDescription',
        'entries' => [
            self::WBM_GTM_ENABLED_COOKIE_DATA,
        ],
    ];

    /**
     * @var CookieProviderInterface
     */
    private $originalService;

    /**
     * @var SystemConfigService
     */
    private $systemConfigService;

    public function __construct(
        CookieProviderInterface $service,
        SystemConfigService $systemConfigService
    ) {
        $this->originalService = $service;
        $this->systemConfigService = $systemConfigService;
    }

    public function getCookieGroups(): array
    {
        if (!$this->systemConfigService->get('WbmTagManagerEcomm.config.hasSWConsentSupport')) {
            return $this->originalService->getCookieGroups();
        }

        return $this->addEntryToStatisticalGroup();
    }

    protected function addEntryToStatisticalGroup(): array
    {
        $cookieGroups = $this->originalService->getCookieGroups();

        foreach ($cookieGroups as &$group) {
            if ($group['snippet_name'] !== 'cookie.groupStatistical') {
                continue;
            }

            $group['entries'] = array_merge($group['entries'], [self::WBM_GTM_ENABLED_COOKIE_DATA]);

            return $cookieGroups;
        }

        return array_merge($cookieGroups, [self::WBM_GTM_COOKIE_GROUP_DATA]);
    }
}
