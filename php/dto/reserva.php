<?php
class Reserva {
    protected $reservaId;
    protected $nombreUsuario;
    protected $recursoId;
    protected $fechaInicioReserva;
    protected $fechaFinReserva;

    public function __construct($nombreUsuario,$recursoId,$fechaInicioReserva,$fechaFinReserva){
        $this->nombreUsuario = $nombreUsuario;
        $this->recursoId = $recursoId;
        $this->fechaInicioReserva = $fechaInicioReserva;
        $this->fechaFinReserva = $fechaFinReserva;
    }

    public function getReservaId(){
        return $this->reservaId;
    }
    public function getNombreUsuario(){
        return $this->nombreUsuario;
    }

    public function getRecursoId(){
        return $this->recursoId;
    }

    public function getFechaInicioReserva(){
        return $this->fechaInicioReserva;
    }
    public function getFechaFinReserva(){
        return $this->fechaFinReserva;
    }
}
?>