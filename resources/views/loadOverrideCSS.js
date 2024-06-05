document.addEventListener('DOMContentLoaded', function () {
    var cssLink = document.createElement('link');
    cssLink.href = 'override.css'; // Ajusta la ruta según sea necesario
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    document.head.appendChild(cssLink);
});
