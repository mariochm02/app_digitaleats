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

        Item::create(['name' => 'Coca Cola', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://live.staticflickr.com/65535/53786632735_c107457550_m.jpg']);
        Item::create(['name' => 'Fanta de naranja', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://live.staticflickr.com/65535/53785277362_1064d64601_m.jpg']);
        Item::create(['name' => 'Sprite', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://live.staticflickr.com/65535/53785282437_5a7136e917_m.jpg']);
        Item::create(['name' => 'Nestea', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://live.staticflickr.com/65535/53786653970_57e1fa472c_m.jpg']);

        Item::create(['name' => 'Flor', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://live.staticflickr.com/65535/53785300897_48e153bf85_m.jpg']);
        Item::create(['name' => 'Marques de Victoria', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://live.staticflickr.com/65535/53786661125_8ed376da94_m.jpg']);

        Item::create(['name' => 'Salpicon de marisco', 'price' => 4.50, 'subcategory_id' => $tapas->id, 'image_url' => 'https://live.staticflickr.com/65535/53786235286_baec53da09_m.jpg']);
        Item::create(['name' => 'Jamon', 'price' => 8.50, 'subcategory_id' => $tapas->id, 'image_url' => 'https://live.staticflickr.com/65535/53786423438_bbef7d48e1_m.jpg']);

        Item::create(['name' => 'Lomo de angus', 'price' => 15.50, 'subcategory_id' => $carnes->id, 'image_url' => 'https://live.staticflickr.com/65535/53785269367_eaef636072_m.jpg']);

        Item::create(['name' => 'Pizza peperoni', 'price' => 9.50, 'subcategory_id' => $pizzas->id, 'image_url' => 'https://live.staticflickr.com/65535/53786568674_ce015f498a_m.jpg']);
    }
}
