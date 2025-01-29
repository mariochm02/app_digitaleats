import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <main className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-black"> 
            <header className='border-4 border-amber-300 mb-8 w-30 h-30'>
            <img className='w-80 h-80' src="http://digitaleats.ddns.net:8080/logo.jpeg" alt="" />

            </header>

            <article className="w-full bg-black sm:max-w-md mt-1 px-6 py-4 text-white shadow-md overflow-hidden sm:rounded-lg border-amber-300 border-4">
                {children} 
            </article>
        </main>
    );
}