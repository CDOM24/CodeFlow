<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyChallenge extends Model
{
    protected $fillable = [
        'external_id',
        'title',
        'difficulty',
        'xp',
        'description',
        'expected_answer',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'xp' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}
