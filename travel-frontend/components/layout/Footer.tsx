export default function Footer() {
  return (
    <footer className="border-t border-teal-800 bg-teal-900 py-8">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm text-teal-200/70">
          &copy; {new Date().getFullYear()} Travel Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
