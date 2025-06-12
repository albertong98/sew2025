<?php
class AuthController extends Controller
{
    private function logout(): void
    {
        AuthenticationController::logOutUser();
        SessionController::redirectHome();
    }
}
?>