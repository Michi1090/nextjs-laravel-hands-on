<?php

use App\Http\Controllers\MemoController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/user', function () {
    $user = Auth::user();
    return $user ? new UserResource($user) : null;
});

Route::get('/memos', [MemoController::class, 'fetch']);
Route::post('/memos', [MemoController::class, 'create']);
