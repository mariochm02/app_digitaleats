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
        $pizzas = Subcategory::create(['name' => 'Pizzas', 'category_id' => $comidas->id]);
        $pastas = Subcategory::create(['name' => 'Pastas', 'category_id' => $comidas->id]);

        Item::create(['name' => 'Coca Cola', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://example.com/coca-cola.jpg']);
        Item::create(['name' => 'Nestlé', 'price' => 1.50, 'subcategory_id' => $refrescos->id, 'image_url' => 'https://example.com/nestle.jpg']);
        Item::create(['name' => 'Copa de Vino Blanco', 'price' => 3.00, 'subcategory_id' => $vinos->id, 'image_url' => 'https://example.com/vino-blanco.jpg']);
        Item::create(['name' => 'Pizza 4 Quesos', 'price' => 8.50, 'subcategory_id' => $pizzas->id, 'image_url' => 'https://example.com/pizza-4-quesos.jpg']);
        Item::create(['name' => 'Pasta Carbonara', 'price' => 7.00, 'subcategory_id' => $pastas->id, 'image_url' => 'https://example.com/pasta-carbonara.jpg']);
    }
}
