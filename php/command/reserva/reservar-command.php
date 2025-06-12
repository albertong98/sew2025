<?php

class ReservaCommand extends Command
{
    private ReservaController $reservaController;

    public function __construct(){
        $this->reservaController = new ReservaController();
    }

    public function execute(){
        if(isset($_POST[ReservaFormModel::RECURSO_KEY])) $recurso = $_POST[ReservaFormModel::RECURSO_KEY];
        if(isset($_POST[ReservaFormModel::FECHA_INICIO_KEY])) $fechaInicio = $_POST[ReservaFormModel::FECHA_INICIO_KEY];
        if(isset($_POST[ReservaFormModel::FECHA_FIN_KEY])) $fechaFin = $_POST[ReservaFormModel::FECHA_FIN_KEY];

        $reserva = new Reserva($_SESSION[ReservaFormModel::USERNAME_KEY],$recurso,$fechaInicio,$fechaFin);

        $reservaController->registerReserva($reserva);
    }
}
?>