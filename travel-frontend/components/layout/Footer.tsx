export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-800 py-8">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm text-slate-300/70">
          &copy; {new Date().getFullYear()} Travel Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
