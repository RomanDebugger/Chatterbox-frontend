
import FloatingBackground from '../components/FloatingBackground';

export default function MainLayout({ children }) {


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-700">
      <FloatingBackground/>
      <main className="h-full">
        {children}
      </main>
    </div>
  );
}
