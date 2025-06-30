export default function AuthForm({
  activeForm, form, setForm, handleSubmit, isLoading
})

 {  
  const buttonClass = activeForm === 'login'
    ? 'bg-gradient-to-r from-amber-400 to-rose-400'
    : 'bg-gradient-to-r from-sky-400 to-indigo-400';
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="username"
        value={form.username}
        onChange={(e) => setForm({...form, username: e.target.value})}
        className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
        placeholder="Username"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({...form, password: e.target.value})}
        className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
        placeholder="Password"
      />
      {activeForm === 'signup' && (
        <input
          name="confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          placeholder="Confirm password"
        />
      )}
      {activeForm === 'signup' && form.password && form.confirmPassword && form.password !== form.confirmPassword && (
        <p className="text-sm text-rose-400">Password do not match</p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 font-medium rounded-lg text-white ${buttonClass} hover:shadow-md transition-all flex items-center justify-center`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {activeForm === 'login' ? 'Logging in...' : 'Creating account...'}
          </>
        ) : (
          activeForm === 'login' ? 'Let me in! 🚪' : 'Let me cook! 🍳'
        )}
      </button>
    </form>
  );
}
