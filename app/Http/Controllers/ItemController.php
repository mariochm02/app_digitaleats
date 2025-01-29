<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Subcategory;
use Illuminate\Support\Facades\Gate;

class ItemController extends Controller
{
public function index()
{
	    if (!Gate::allows('viewAny', User::class)) {
        abort(403, 'Acceso no autorizado.');
    }
    // Cargar relaciones con subcategoría y categoría
    $items = Item::with('subcategory.category')->get()->map(function ($item) {
        $item->price = (float) $item->price; // Convertir el precio a número
        return $item;
    });

    return Inertia::render('Items/Index', [
        'items' => $items ?? [],
        'auth' => [
            'user' => auth()->user() ?? null,
        ],
    ]);
}




public function create()
{
    $items = Item::with('subcategory.category')->get();

    return Inertia::render('Items/Create', [
        'items' => $items, // Similar a index
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
}


   public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'category_id' => 'nullable|exists:categories,id',
        'subcategory_id' => 'nullable|exists:subcategories,id',
        'new_category' => 'nullable|string|max:255',
        'new_subcategory' => 'nullable|string|max:255',
    ]);

    // Crear nueva categoría si se proporciona
    $category = null;
    if ($request->filled('new_category')) {
        $category = Category::create(['name' => $request->new_category]);
    }

    // Crear nueva subcategoría si se proporciona
    $subcategory = null;
    if ($request->filled('new_subcategory')) {
        $subcategory = Subcategory::create([
            'name' => $request->new_subcategory,
            'category_id' => $category ? $category->id : $request->category_id,
        ]);
    }

    // Crear el ítem
    Item::create([
        'name' => $request->name,
        'price' => $request->price,
        'subcategory_id' => $subcategory ? $subcategory->id : $request->subcategory_id,
    ]);

    return redirect()->route('items.index')->with('success', 'Item creado correctamente.');
}

public function edit(Item $item)
{
    $items = Item::with('subcategory.category')->get();

    return Inertia::render('Items/Edit', [
        'item' => $item,
        'items' => $items, // Similar a index
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
}


  public function update(Request $request, Item $item)
{
     $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'category_id' => 'nullable|exists:categories,id',
        'subcategory_id' => 'nullable|exists:subcategories,id',
        'new_category' => 'nullable|string|max:255',
        'new_subcategory' => 'nullable|string|max:255',
        'image_url' => 'nullable|url|max:500', // Validación del campo URL
    ]);

    // Crear nueva categoría si se proporciona
    $category = null;
    if ($request->filled('new_category')) {
        $category = Category::create(['name' => $request->new_category]);
    }

    // Crear nueva subcategoría si se proporciona
    $subcategory = null;
    if ($request->filled('new_subcategory')) {
        $subcategory = Subcategory::create([
            'name' => $request->new_subcategory,
            'category_id' => $category ? $category->id : $request->category_id,
        ]);
    }

    // Actualizar el ítem
  $item->update([
        'name' => $request->name,
        'price' => $request->price,
        'subcategory_id' => $request->subcategory_id,
        'image_url' => $request->image_url, // Se guarda en la DB
    ]);

    return redirect()->route('items.index')->with('success', 'Item actualizado correctamente.');
}


    public function destroy(Item $item)
    {
        $item->delete();
        return redirect()->route('items.index')->with('success', 'Item eliminado exitosamente.');
    }
}
