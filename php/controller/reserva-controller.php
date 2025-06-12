<?php
include '../persistence/database-gateway.php'

class ReservaController
{
    private DatabaseGateway $dbGateway;
    
    public function __construct(){
        $this->dbGateway = new DatabaseGateway();
    }

    public function registerReserva(Reserva $reserva){
        if(SessionController::userIsLogged()){
            $dbGateway->insertReserva($reserva);
        }
    }
}
?>