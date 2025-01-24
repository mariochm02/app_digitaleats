import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '7cfe1320d155f302b914',  // Reemplaza con tu clave de Pusher
    cluster: 'eu',  // Reemplaza con tu cluster de Pusher
    encrypted: true,
    forceTLS: true,
});