export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-8">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} Travel Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
