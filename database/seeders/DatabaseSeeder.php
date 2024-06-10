<?php

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Item;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $bebidas = Category::create(['name' => 'Bebidas']);
        $comidas = Category::create(['name' => 'Comidas']);

        $refrescos = Subcategory::create(['name' => 'Refrescos', 'category_id' => $bebidas->id]);
        $vinos = Subcategory::create(['name' => 'Vinos', 'category_id' => $bebidas->id]);
        $tapas = Subcategory::create(['name' => 'Tapas', 'category_id' => $comidas->id]);
        $carnes = Subcategory::create(['name' => 'Carnes', 'category_id' => $comidas->id]);
        $pizzas = Subcategory::create(['name' => 'Pizzas', 'category_id' => $comidas->id]);
        

        Item::create(['name' => 'Coca Cola', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://example.com/coca-cola.jpg']);
        Item::create(['name' => 'Fanta de naranja', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://example.com/nestle.jpg']);
        Item::create(['name' => 'Sprite', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://example.com/nestle.jpg']);
        Item::create(['name' => 'Nestea', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://example.com/nestle.jpg']);

        Item::create(['name' => 'Flor', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://example.com/vino-blanco.jpg']);
        Item::create(['name' => 'Marques de Victoria', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://example.com/vino-blanco.jpg']);
        Item::create(['name' => 'Portia', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://example.com/vino-blanco.jpg']);
        Item::create(['name' => 'Basardilla', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://example.com/vino-blanco.jpg']);
        Item::create(['name' => 'Barbadillo Vi', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://example.com/vino-blanco.jpg']);
        Item::create(['name' => 'Castillo Santiago', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://example.com/vino-blanco.jpg']);
        Item::create(['name' => 'Ramon Bilbao', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://example.com/vino-blanco.jpg']);

        Item::create(['name' => 'Salpicon de marisco', 'price' => 8.50, 'subcategory_id' => $tapas->id, 'image_url' => 'https://example.com/pizza-4-quesos.jpg']);
        Item::create(['name' => 'Jamon', 'price' => 8.50, 'subcategory_id' => $tapas->id, 'image_url' => 'https://example.com/pizza-4-quesos.jpg']);

        Item::create(['name' => 'Lomo de angus', 'price' => 8.50, 'subcategory_id' => $carnes->id, 'image_url' => 'https://example.com/pizza-4-quesos.jpg']);

        Item::create(['name' => 'Pizza 4 Quesos', 'price' => 8.50, 'subcategory_id' => $pizzas->id, 'image_url' => 'https://example.com/pizza-4-quesos.jpg']);
        
    }
}