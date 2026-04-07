<?php
declare(strict_types=1);
namespace App\Http\Models;

if (!defined('ATOMIC_START')) exit;

use DB\SQL\Schema;
use Engine\Atomic\App\Model;
use Engine\Atomic\Auth\Interfaces\AuthenticatableInterface;
use Engine\Atomic\Auth\Interfaces\HasRolesInterface;

class User extends Model implements AuthenticatableInterface, HasRolesInterface
{
    protected $table = 'users';
    protected $db = 'DB';
    protected $fieldConf = [
        'uuid' => [
            'type' => Schema::DT_VARCHAR128,
            'nullable' => false,
            'unique' => true,
        ],
        'name' => [
            'type' => Schema::DT_VARCHAR256,
            'nullable' => true,
        ],
        'email' => [
            'type' => Schema::DT_VARCHAR256,
            'nullable' => false,
            'unique' => true,
        ],
        'password' => [
            'type' => Schema::DT_VARCHAR256,
            'nullable' => true,
        ],
        'role' => [
            'type' => Schema::DT_VARCHAR128,
            'nullable' => true,
        ],
        'avatar_url' => [
            'type' => Schema::DT_VARCHAR256,
            'nullable' => true,
        ],
        'created_at' => [
            'type' => Schema::DT_TIMESTAMP,
            'nullable' => true,
        ],
        'updated_at' => [
            'type' => Schema::DT_TIMESTAMP,
            'nullable' => true,
        ],
    ];

    public function get_auth_id(): string
    {
        return (string)$this->uuid;
    }

    public function get_password_hash(): ?string
    {
        $hash = $this->password ?? null;
        return empty($hash) ? null : $hash;
    }

    public function get_role_slugs(): array
    {
        $role = $this->role ?? null;
        return $role ? [(string)$role] : [];
    }

    public function get_display_name(): string
    {
        $name = trim((string)($this->name ?? ''));
        if ($name !== '') {
            return $name;
        }

        return (string)($this->email ?? '');
    }

    public function get_avatar_initials(): string
    {
        $displayName = $this->get_display_name();
        if ($displayName === '') {
            return '';
        }

        $words = preg_split('/\s+/', $displayName) ?: [];
        $initials = '';

        foreach ($words as $word) {
            if ($word === '' || mb_strlen($initials) >= 2) {
                continue;
            }
            $initials .= mb_strtoupper(mb_substr($word, 0, 1));
        }

        if ($initials !== '') {
            return $initials;
        }

        return mb_strtoupper(mb_substr($displayName, 0, 1));
    }
}
