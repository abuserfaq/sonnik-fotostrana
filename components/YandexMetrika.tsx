import Script from 'next/script';

function metrikaId(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? '108988416';
  const digits = String(fromEnv).replace(/\D/g, '');
  return digits.length ? digits : null;
}

export function YandexMetrika() {
  const id = metrikaId();
  if (!id) return null;

  const loaderSrc = `https://mc.yandex.ru/metrika/tag.js?id=${id}`;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) { return; }
          }
          k=e.createElement(t),
          a=e.getElementsByTagName(t)[0],
          k.async=1,k.src=r,
          a.parentNode.insertBefore(k,a)
        })(window, document,'script','${loaderSrc}', 'ym');

        ym(${id}, 'init', {
          ssr: true,
          webvisor: true,
          clickmap: true,
          ecommerce: 'dataLayer',
          referrer: document.referrer,
          url: location.href,
          accurateTrackBounce: true,
          trackLinks: true,
        });`}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            alt=""
            width={1}
            height={1}
            style={{
              position: 'absolute',
              left: '-9999px',
              visibility: 'hidden',
            }}
          />
        </div>
      </noscript>
    </>
  );
}
