import React from 'react';

export default function Invoice({ order }) {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
            <h1>Factura Pedido #{order.id}</h1>
            <p><strong>Fecha:</strong> {order.date}</p>
            <p><strong>Cliente:</strong> {order.customer_name}</p>

            <h2>Detalles del Pedido</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Artículo</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Cantidad</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Precio Unitario</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.details.map((detail, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid black', padding: '10px' }}>{detail.item}</td>
                            <td style={{ border: '1px solid black', padding: '10px' }}>{detail.quantity}</td>
                            <td style={{ border: '1px solid black', padding: '10px' }}>
                                ${(detail.price / detail.quantity).toFixed(2)}
                            </td>
                            <td style={{ border: '1px solid black', padding: '10px' }}>
                                ${detail.price.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 style={{ fontWeight: 'bold' }}>Total: ${order.total.toFixed(2)}</h3>
        </div>
    );
}
