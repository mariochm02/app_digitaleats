<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Kitchen;
use App\Models\Dashboard;
use App\Policies\UserPolicy;
use App\Policies\KitchenPolicy;
use App\Policies\DashboardPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
		Order::class => OrderPolicy::class,
		Kitchen::class => KitchenPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
