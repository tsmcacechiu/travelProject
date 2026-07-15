import Link from "next/link";

const features = [
  {
    label: "旅遊文章",
    description: "深度遊記與旅行故事",
    href: "/articles",
  },
  {
    label: "旅遊攻略",
    description: "實用資訊、地圖與 PDF 下載",
    href: "/guides",
  },
  {
    label: "生命倒數",
    description: "極簡哲學工具，審視你的時間",
    href: "/countdown",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-amber-400 uppercase">
          Travel Project
        </p>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white md:text-7xl">
          探索世界，<br />記錄每一刻
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/60">
          旅遊文章、攻略與哲學工具的個人知識庫
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/articles"
            className="rounded-full bg-amber-400 px-8 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            閱讀文章
          </Link>
          <Link
            href="/guides"
            className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            瀏覽攻略
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            探索功能
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-amber-400/40 hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold text-white group-hover:text-amber-400">
                  {f.label}
                </h3>
                <p className="mt-2 text-sm text-white/50">{f.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
