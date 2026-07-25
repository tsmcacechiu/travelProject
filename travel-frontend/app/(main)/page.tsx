import Link from "next/link";

const features = [
  {
    label: "旅遊文章",
    description: "深度遊記與旅行故事",
    href: "/articles",
    accent: "from-sky-400 to-sky-600",
  },
  {
    label: "旅遊攻略",
    description: "實用資訊、地圖與 PDF 下載",
    href: "/guides",
    accent: "from-emerald-400 to-emerald-600",
  },
  {
    label: "生命倒數",
    description: "極簡哲學工具，審視你的時間",
    href: "/countdown",
    accent: "from-teal-400 to-teal-600",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-400 via-teal-500 to-emerald-500 px-6 text-center">
        <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-white/90 uppercase">
          Travel Project
        </p>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white drop-shadow-sm md:text-7xl">
          探索世界，<br />記錄每一刻
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/90">
          旅遊文章、攻略與哲學工具的個人知識庫
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/articles"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-600 shadow-lg transition-transform hover:scale-105"
          >
            閱讀文章
          </Link>
          <Link
            href="/guides"
            className="rounded-full border border-white/70 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            瀏覽攻略
          </Link>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-800">
            探索功能
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mb-4 h-1.5 w-10 rounded-full bg-gradient-to-r ${f.accent}`}
                />
                <h3 className="text-xl font-semibold text-slate-800 group-hover:text-emerald-600">
                  {f.label}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{f.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
