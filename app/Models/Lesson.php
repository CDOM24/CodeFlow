<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'learning_level_id',
        'external_id',
        'title',
        'description',
        'xp',
        'type',
        'content',
        'objective',
        'instruction',
        'expected_answer',
        'hint',
        'success_message',
        'blocks',
        'options',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'xp' => 'integer',
            'blocks' => 'array',
            'options' => 'array',
            'sort_order' => 'integer',
        ];
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(LearningLevel::class, 'learning_level_id');
    }
}
