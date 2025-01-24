<?php

namespace App\Events;

use App\Models\KitchenOrderStatus;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $status;

    public function __construct(KitchenOrderStatus $status)
    {
        $this->status = $status;
    }

    public function broadcastOn()
    {
        return new Channel('orders');
    }
}
