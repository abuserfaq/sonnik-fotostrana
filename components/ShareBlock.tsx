'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getSiteOrigin } from '@/lib/site-config';

type Props = {
  /** Заголовок для соцсетей и системного диалога */
  title?: string;
  /** Путь вида `/sonnik/zmei` — по умолчанию текущий маршрут */
  sharePath?: string;
  variant?: 'default' | 'compact';
  className?: string;
};

export function ShareBlock({
  title = 'Сонник — толкование снов',
  sharePath,
  variant = 'default',
  className = '',
}: Props) {
  const pathname = usePathname();
  const path =
    typeof sharePath === 'string' && sharePath.startsWith('/')
      ? sharePath
      : pathname || '/';

  const origin = getSiteOrigin();
  const shareUrl = path === '/' ? `${origin}/` : `${origin}${path}`;
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function',
    );
  }, []);

  const { vk, telegram, ok } = useMemo(
    () =>
      ({
        vk: `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
        ok: `https://connect.ok.ru/offer?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
      }) as const,
    [shareUrl, title],
  );

  const onNativeShare = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.share) return;
    try {
      await navigator.share({ title, text: title, url: shareUrl });
    } catch {
      /* отмена пользователем или ошибка — молча */
    }
  }, [shareUrl, title]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  const rootClass =
    variant === 'compact'
      ? `share-block share-block--compact ${className}`.trim()
      : `share-block ${className}`.trim();

  return (
    <div className={rootClass} aria-label="Поделиться страницей">
      {variant !== 'compact' ? (
        <p className="share-block-label">Поделиться</p>
      ) : null}
      <div className="share-block-actions">
        {canNativeShare ? (
          <button
            type="button"
            className="share-btn share-btn--system"
            aria-label="Поделиться через приложение"
            title="Поделиться"
            onClick={() => {
              void onNativeShare();
            }}
          >
            {variant === 'compact' ? '↗' : 'Поделиться'}
          </button>
        ) : null}
        <a
          className="share-btn"
          href={vk}
          target="_blank"
          rel="noopener noreferrer"
        >
          VK
        </a>
        <a
          className="share-btn"
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram
        </a>
        <a
          className="share-btn"
          href={ok}
          target="_blank"
          rel="noopener noreferrer"
        >
          ОК
        </a>
        <button type="button" className="share-btn" onClick={() => copyLink()}>
          {copied ? 'Скопировано' : 'Ссылка'}
        </button>
      </div>
    </div>
  );
}
