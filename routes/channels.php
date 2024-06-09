Broadcast::channel('orders', function ($user) {
    return Auth::check();
});
