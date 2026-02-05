
import React from 'react';
import { LucideIcon, Menu, X, BrainCircuit } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Person-Organization FIT", isAdmin = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight cursor-pointer" onClick={() => window.location.hash = ''}>
            <BrainCircuit size={28} />
            <span className="hidden sm:inline">{title}</span>
            <span className="sm:hidden">P-O FIT</span>
          </div>
          
          <nav className="flex items-center gap-6">
            {isAdmin ? (
              <>
                <button 
                  onClick={() => window.location.hash = '#/admin'} 
                  className="text-sm font-medium text-slate-600 hover:text-primary"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => window.location.hash = '#/'} 
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <button 
                onClick={() => window.location.hash = '#/admin-login'} 
                className="text-sm font-medium text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
              >
                Entrar Admin
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            © 2024 Person-Organization FIT. Todos os direitos reservados.
          </p>
          <div className="mt-2 flex justify-center gap-4 text-xs text-slate-400">
            <a href="#" className="hover:underline">Privacidade</a>
            <a href="#" className="hover:underline">Termos de Serviço</a>
            <a href="#" className="hover:underline">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
