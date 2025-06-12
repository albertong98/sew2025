<?php
class SessionController
{
    public function session_start(): void
    {
        if (PHP_SESSION_NONE == session_status()) session_start();
    }

    public static function logIn(string $username): void
    {
        $this->session_start();
        $_SESSION[UserFormModel::USERNAME_KEY] = $username;
    }

    public static function logOut(): void
    {
        $this->session_start();
        unset($_SESSION[UserFormModel::USERNAME_KEY]);
    }

    public static function userIsLogged(): bool
    {
        $this->session_start();
        return isset($_SESSION[UserFormModel::USERNAME_KEY]);
    }

    public static function destroy(): void
    {
        $this->session_start();
        session_destroy();
        $_SESSION = [];
    }

    public static function redirectHome(): void
    {
        header("Location: ../../../reservas.php");
        exit();
    }
}
