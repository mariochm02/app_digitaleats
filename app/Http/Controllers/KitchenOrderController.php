<?php

public function update (Request $request, $id)
{
	$order = KitchenOrderStatus::findOrFail($id)
	$order->status = $request->status;
	$order->save();
	
	return response()->json(['message' => 'Pedido actualizado con éxito']);
	
	
	
}