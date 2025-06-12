<?php
class LoginCommand extends Command
{
    private function execute(): void
    {
        $username = '';
        $password = '';

        if(isset($_POST[UserFormModel::USERNAME_KEY])) $username = $_POST[UserFormModel::USERNAME_KEY];
        if(isset($_POST[UserFormModel::PASSWORD_KEY])) $password = $_POST[UserFormModel::PASSWORD_KEY];

        if (empty($email) || empty($password)) {
            SessionController::redirectHome();
        }

        $usuario = new Usuario();
        $usuario->username = $username;

        if ($usuario->emailExists() && $usuario->verifyPassword($password)) {
            SessionController::login($usuario->id, $usuario->nombre, $usuario->email);
        }

        SessionController::redirectHome();
    }
}
?>