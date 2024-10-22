<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique(); 
            $table->string('password');
            $table->enum('gender', ['male', 'female', 'other'])->nullable(); // Campo para género
            $table->string('profile_image')->nullable(); // Campo para imagen de perfil
            $table->text('bio')->nullable(); // Campo para una breve biografía
            $table->string('nickname')->nullable(); // Campo para apodo o nombre de usuario
            $table->date('birthdate')->nullable(); // Campo para fecha de nacimiento
            $table->string('location')->nullable(); // Campo para la ubicación del usuario
            $table->string('interests')->nullable(); // Campo para intereses o pasatiempos
            $table->string('favorite_color')->nullable(); // Campo para color favorito
            $table->string('favorite_food')->nullable(); // Campo para comida favorita
            $table->string('social_media_links')->nullable(); // Campo para enlaces a redes sociales (puede ser JSON o texto plano)
            $table->boolean('is_active')->default(true); // Campo para estado del usuario
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};