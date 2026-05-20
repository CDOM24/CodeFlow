<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningLevel extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'title',
        'description',
        'color',
        'icon',
        'sort_order',
        'is_unlocked_by_default',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_unlocked_by_default' => 'boolean',
        ];
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order');
    }
}
