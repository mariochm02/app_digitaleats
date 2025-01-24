import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-purple-500 text-purple-500 focus:border-indigo-700 '
                    : 'border-transparent text-white hover:text-amber-400 hover:border-amber-400 focus:text-amber-400 focus:border-gray-300 ') +
                className
            }
        >
            {children}
        </Link>
    );
}