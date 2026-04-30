import Link from 'next/link';

import { ShareBlock } from '@/components/ShareBlock';

import { getFotostranaMainUrl } from '@/lib/site-config';

export function AdminOutboundBar() {
  const fsUrl = getFotostranaMainUrl();
  return (
    <div className="admin-outbound-wrap">
      <div className="admin-outbound shell admin-page">
        <a
          className="btn btn-admin-fs"
          href={fsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Вернуться в Фотострану
        </a>
        <Link className="btn btn-ghost btn-admin-mini" href="/">
          Открыть сонник
        </Link>
        <ShareBlock
          variant="compact"
          title="Сонник — толкование снов Фотостраны"
          sharePath="/"
        />
      </div>
    </div>
  );
}
