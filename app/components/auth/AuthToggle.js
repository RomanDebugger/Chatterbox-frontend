export default function AuthToggle({ activeForm, setActiveForm, onFormChange }) {
  return (
    <div className="flex bg-slate-700/50 rounded-lg p-1 mb-6">
      <button
        onClick={() => {
          setActiveForm('login');
          onFormChange('login');
        }}
        className={`flex-1 py-2 rounded-md transition-all ${
          activeForm === 'login'
            ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-white shadow-md'
            : 'text-slate-300 hover:text-white'
        }`}
      >
        Login
      </button>
      <button
        onClick={() => {
          setActiveForm('signup');
          onFormChange('signup');
        }}
        className={`flex-1 py-2 rounded-md transition-all ${
          activeForm === 'signup'
            ? 'bg-gradient-to-r from-sky-400 to-indigo-400 text-white shadow-md'
            : 'text-slate-300 hover:text-white'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}