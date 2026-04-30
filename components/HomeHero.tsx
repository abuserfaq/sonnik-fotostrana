import Image from 'next/image';
import Link from 'next/link';

export function HomeHero() {
  return (
    <section className="hero" aria-label="Введение">
      <div className="hero-media">
        <Image
          className="hero-img"
          src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1920&q=85&auto=format&fit=crop"
          alt="Ночное звёздное небо"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-scrim" aria-hidden="true" />
      </div>
      <div className="hero-content shell-wide">
        <p className="hero-eyebrow">Экосистема Фотостраны</p>
        <h1 className="hero-title">
          Сонник:
          <span className="hero-title-line">спокойные толкования</span>
        </h1>
        <p className="hero-lead">
          Вода, отношения, животные — разбираем образы по Миллеру, Фрейду и
          народным сонникам. Одна тема, одна страница, удобно читать с телефона.
        </p>
        <div className="hero-actions">
          <Link href="/sonnik" className="btn btn-primary">
            Смотреть символы
          </Link>
          <Link href="/o-proekte" className="btn btn-ghost">
            Как устроен сонник
          </Link>
        </div>
      </div>
    </section>
  );
}
