<?php
include '../persistence/database-gateway.php'

class AuthenticationController
{
    private DatabaseGateway $dbGateway;
    
    public function __construct(){
        $this->dbGateway = new DatabaseGateway();
    }

    public static function logInUser(string $username,string $password){
        if($dbGateway->checkUserLogin($username,$password)){
           SessionController::logIn($username);
        }
    }

    public static function logOutUser(){
        SessionController::logOut();
    }
}
?>