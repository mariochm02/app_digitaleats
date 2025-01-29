<?php

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Item;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Truncate the tables
        Item::truncate();
        Subcategory::truncate();
        Category::truncate();

        $bebidas = Category::create(['name' => 'Bebidas']);
        $comidas = Category::create(['name' => 'Comidas']);

        $refrescos = Subcategory::create(['name' => 'Refrescos', 'category_id' => $bebidas->id]);
        $vinos = Subcategory::create(['name' => 'Vinos', 'category_id' => $bebidas->id]);
        $tapas = Subcategory::create(['name' => 'Tapas', 'category_id' => $comidas->id]);
        $carnes = Subcategory::create(['name' => 'Carnes', 'category_id' => $comidas->id]);
        $pizzas = Subcategory::create(['name' => 'Pizzas', 'category_id' => $comidas->id]);

        Item::create(['name' => 'Coca Cola', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://tse2.mm.bing.net/th?id=OIG2.KmvH2t2Jfz_2rw7EUj4S&pid=ImgGn']);
        Item::create(['name' => 'Fanta de naranja', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://tse2.mm.bing.net/th?id=OIG4.0JLPe5k40NvHD2PlVKDN&pid=ImgGn']);
        Item::create(['name' => 'Sprite', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://tse1.mm.bing.net/th?id=OIG3.Padek1dX2ufCTfzJgWOQ&pid=ImgGn']);
        Item::create(['name' => 'Nestea', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://tse4.mm.bing.net/th?id=OIG1.WuuwJYtBZJDx3L1UnSsm&pid=ImgGn']);

        Item::create(['name' => 'Flor', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://tse2.mm.bing.net/th?id=OIG2.1pWdQzESzrsr63IOP2Nw&pid=ImgGn']);
        Item::create(['name' => 'Marques de Victoria', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://tse3.mm.bing.net/th?id=OIG3.4HgJH6Mv59ij9LOX.aeu&pid=ImgGn']);

        Item::create(['name' => 'Pulpos a la gallega', 'price' => 4.50, 'subcategory_id' => $tapas->id, 'image_url' => 'https://tse1.mm.bing.net/th?id=OIG3.1.6l.3M3NT3Vu_Di0WCf&pid=ImgGn']);
        Item::create(['name' => 'Carrillada', 'price' => 8.50, 'subcategory_id' => $tapas->id, 'image_url' => 'https://tse3.mm.bing.net/th?id=OIG3.XH7aYFnQyrYCHlm0GrP_&pid=ImgGn']);
        Item::create(['name' => 'Jamon', 'price' => 8.50, 'subcategory_id' => $tapas->id, 'image_url' => 'https://tse1.mm.bing.net/th?id=OIG3.KAd4HkCrJyPHjEdRg9pp&pid=ImgGn']);

        Item::create(['name' => 'Costilla de cerdo', 'price' => 15.50, 'subcategory_id' => $carnes->id, 'image_url' => 'https://tse2.mm.bing.net/th?id=OIG3.veU6xFb1H8a4wzhinZgR&pid=ImgGn']);
        Item::create(['name' => 'Lomo de angus', 'price' => 15.50, 'subcategory_id' => $carnes->id, 'image_url' => 'https://tse3.mm.bing.net/th?id=OIG2.ezXhtaJw1kCbCm2a3if8&pid=ImgGn']);

        Item::create(['name' => 'prosciutto e funghi', 'price' => 10.50, 'subcategory_id' => $pizzas->id, 'image_url' => 'https://tse1.mm.bing.net/th?id=OIG4.hpmC37vyydQ90sz0.Ix9&pid=ImgGn']);
        Item::create(['name' => 'prosciutto e funghi', 'price' => 8.50, 'subcategory_id' => $pizzas->id, 'image_url' => 'https://tse3.mm.bing.net/th?id=OIG1.Xll.JsXpqeV_bx0B7Zun&pid=ImgGn']);
        Item::create(['name' => 'Diavola', 'price' => 9.50, 'subcategory_id' => $pizzas->id, 'image_url' => 'https://tse4.mm.bing.net/th?id=OIG2.guwUcbsPNNb9NtwktpKT&pid=ImgGn']);
    }
}
