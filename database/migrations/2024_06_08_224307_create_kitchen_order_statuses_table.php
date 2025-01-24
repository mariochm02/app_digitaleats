<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKitchenOrderStatusesTable extends Migration
{
    public function up()
    {
        Schema::create('kitchen_order_statuses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('order_detail_id');
            $table->string('status');
            $table->timestamps();

            // Relaciones (si existen claves foráneas)
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('order_detail_id')->references('id')->on('order_details')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('kitchen_order_statuses');
    }
}
