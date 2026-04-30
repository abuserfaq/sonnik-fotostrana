import Link from 'next/link';
import { FotostranaCta } from '@/components/FotostranaCta';
import { HomeHero } from '@/components/HomeHero';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <section className="page-block">
        <div className="shell">
          <h2 className="page-title">Зачем отдельные страницы</h2>
          <p className="lead">
            Каждый образ — свой адрес в поиске. Структура текста одна и та же:
            вы быстрее находите нужный блок и сравниваете толкования.
          </p>
          <div className="support-grid">
            <div className="support-item">
              <h2>Классика</h2>
              <p>
                Отдельные смыслы по Миллеру и Фрейду без смешения в одну
                «кашу».
              </p>
            </div>
            <div className="support-item">
              <h2>Народный слой</h2>
              <p>
                Бытовые трактовки и приметы — отдельным блоком, чтобы было
                проще отличать от психоанализа.
              </p>
            </div>
            <div className="support-item">
              <h2>Вывод</h2>
              <p>
                Коротко, как применить сон к своей ситуации, без обещаний и
                дат.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider-faint" />

      <section className="page-block-tight">
        <div className="shell">
          <FotostranaCta />
          <p className="footer-note">
            Материалы не заменяют консультацию психолога или врача.
          </p>
          <p className="footer-note">
            <Link href="/o-proekte">Кто готовит материалы и как связаться</Link>
          </p>
        </div>
      </section>
    </>
  );
}
