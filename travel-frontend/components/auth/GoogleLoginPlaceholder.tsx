export default function GoogleLoginPlaceholder() {
  return (
    <button
      type="button"
      disabled
      title="尚未設定 NEXT_PUBLIC_GOOGLE_CLIENT_ID，Google 登入功能無法使用"
      className="cursor-not-allowed rounded-full border border-dashed border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-400"
    >
      Google 登入未設定
    </button>
  );
}
