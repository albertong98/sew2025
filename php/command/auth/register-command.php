<?php
include '../model/user-form-model.php'
include '../controller/session-controller.php'

class RegisterCommand extends Command
{
    private DatabaseGateway $dbGateway;
    private function execute(): void
    {
        $username = '';
        $password = '';
        $password_confirm = '';

        if(isset($_POST[UserFormModel::USERNAME_KEY])) $username = $_POST[UserFormModel::USERNAME_KEY];
        if(isset($_POST[UserFormModel::PASSWORD_KEY])) $password = $_POST[UserFormModel::PASSWORD_KEY];
        if(isset($_POST[UserFormModel::PASSWORD_CONFIRM_KEY])) $password = $_POST[UserFormModel::PASSWORD_CONFIRM_KEY];

        if ($loginController->isUserRegistered($username)) {
            SessionController::redirectHome();
        }

        if (empty($username) || empty($password) || empty($password_confirm)) {
            SessionController::redirectHome();
        }

        if ($password !== $password_confirm) {
            SessionController::redirectHome();
        }

        if (strlen($password) < 8) {
            SessionController::redirectHome();
        }

        $user = new User($username, $password);

        $dbGateway->registerUser($username,$password);
        
        SessionController::login($username);
        
        SessionController::redirectHome();
    }
}
