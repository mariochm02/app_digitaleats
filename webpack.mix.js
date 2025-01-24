const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
   .react() // Asegúrate de que esta línea está presente
   .postCss('resources/css/app.css', 'public/css', [
       require('tailwindcss'),
   ]);

mix.webpackConfig({
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-react'],
               },
            },
         },
      ],
   },
});
