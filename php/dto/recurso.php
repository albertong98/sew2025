<?php
class Recurso{
    protected $recursoId;
    protected $nombre;
    protected $limite;
    protected $precio;
    protected $desccripcion;

    public function __construct($nombre,$limite,$precio,$desccripcion){
        $this->nombre = $nombre;
        $this->limite = $limite;
        $this->precio = $precio;
        $this->descripcion = $desccripcion;
    }

    public function getNombre(){
        return $this->nombre;
    }

    public function getLimite(){
        return $this->limite;
    }

    public function getPrecio(){
        return $this->precio;
    }

    public function getDescripcion(){
        return $this->descripcion;
    }
}
?>