import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <main className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-black"> 
            <header className='w-30 h-30'>
            <img className='w-80 h-80' src="https://live.staticflickr.com/65535/53778664629_1be5640ba5_m.jpg" alt="" />

            </header>

            <article className="w-full bg-black sm:max-w-md mt-1 px-6 py-4 text-white shadow-md overflow-hidden sm:rounded-lg border-amber-300 border-4">
                {children} 
            </article>
        </main>
    );
}