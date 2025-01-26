<!DOCTYPE html>
<html>
<head>
    <title>Factura Pedido #{{ $order->id }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { font-weight: bold; }
    </style>
</head>
<body>
    <h1>Factura Pedido #{{ $order->id }}</h1>
    <p><strong>Fecha:</strong> {{ $order->created_at }}</p>
    <p><strong>Cliente:</strong> {{ $order->customer_name ?? 'Sin nombre' }}</p>

    <h2>Detalles del Pedido</h2>
    <table>
        <thead>
            <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->details as $detail)
                <tr>
                    <td>{{ $detail->item }}</td>
                    <td>{{ $detail->quantity }}</td>
                    <td>${{ number_format($detail->price / $detail->quantity, 2) }}</td>
                    <td>${{ number_format($detail->price, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h3 class="total">Total: ${{ number_format($order->details->sum('price'), 2) }}</h3>
</body>
</html>
