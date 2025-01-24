<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <style>
            .table {
                width: 100%;
                border-collapse: collapse;
            }
            .table th, .table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            .table th {
                background-color: #f2f2f2;
            }
            .actions {
                display: flex;
                gap: 10px;
            }
            .actions a,
            .actions button {
                color: blue;
                text-decoration: none;
                border: none;
                background: none;
                cursor: pointer;
                font: inherit;
            }
            .actions button {
                color: red;
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        @inertia
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                var deleteLinks = document.querySelectorAll(".actions button");
                deleteLinks.forEach(function(link) {
                    link.style.color = "red";
                });
            });
        </script>
    </body>
</html>
