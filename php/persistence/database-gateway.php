<?php
include '../dto/reserva.php'
class DatabaseGateway{
    const HOST = "localhost";
    const DB_NAME = "reservas";
    const USERNAME = "DBUSER2025";
    const PASSWORD = "DBPWD2025";
    
    public function connect(){
        $db = new mysqli(self::HOST,self::USERNAME, self::PASSWORD, self::DB_NAME);
        return $db;
    }

    public function isUserRegistered(string $username): bool
    {
        $query = "SELECT *
                  FROM Usuarios
                  WHERE username = ?";

        $db = $this->connect();

        $stmt = $db->prepare($query);
        $stmt->bind_param('s',$username);    
        $stmt->execute();

        $num = $stmt->rowCount();
        
        $stmt->close();
        $db->close();
        
        return $num > 0;
    }

    public function registerUser($username,$password){
        $query = "INSERT INTO user (username, password) VALUES (?,?)"
        $db = $this->connect();

        $stmt = $db->prepare();

        $stmt->bind_param('ss',$username,$password);    
        $stmt->execute();        
        $stmt->close();

        $db->close();
    }

    public function insertReserva(Reserva $reserva){
        $db = $this->connect();

        $username = $reserva->getNombreUsuario();
        $fechaInicio = $reserva->getFechaInicioReserva();
        $fechaFin = $reserva->getFechaFinReserva();
        $recursoId = $reserva->getRecursoId();
        
        $limite = $db->prepare("SELECT limite FROM recurso where recurso_id = ?");
        $limite->bind_param('s', $recursoId);
        $limite->execute();
        $limiteResult = $limite->get_result();
        $limiteData = $limiteResult->fetch_assoc();

        $count = $db->prepare("SELECT COUNT(*) FROM reserva where recurso_id = ? AND (fecha_inicio <= ? AND fecha_fin >= ?)");
        $count->bind_param('sss',$recursoId,$fechaInicio,$fechaFin);
        $count->execute();
        $result = $count->get_result();
        $total=$result->fetch_assoc();
        
        if($total['total'] < $limiteData["limite_ocupacion"]){
            $stmt = $db->prepare("INSERT INTO reserva (username,recurso_id,fecha_inicio,fecha_fin) VALUES (?,?,?,?)");
        
            $stmt->bind_param('sss', $username,$recursoId,$fechaInicio,$fechaFin);    

            $stmt->execute();
        }
        
        $stmt->close();

        $db->close();
    }

    public function generarPresupuesto($username){
        $db = $this->connect();

        $prepare = $db->prepare("SELECT * from reserva WHERE username = ?");

        $prepare->bind_param('s',$username);
        $prepare->execute();

        $resultado = $prepare->get_result();

        if ($resultado->fetch_assoc()!=NULL) {
            $resultado->data_seek(0);
            $reservas = array();
            while($fila = $resultado->fetch_assoc()) {
                $preparePrecio = $db->prepare("SELECT precio from recurso WHERE recurso_id in (SELECT recurso_id from reserva WHERE reserva_id = ?)");
                $preparePrecio->bind_param('s',$fila["reserva_id"]);
                $preparePrecio->execute();

                $precio = $preparePrecio->get_result();
                if ($precio->fetch_assoc()!=NULL) {
                    $precio->data_seek(0);
                    while($filaPrecio = $precio->fetch_assoc()) {
                        $reservas[$fila["reserva_id"]] = $filaPrecio["precio"];
                        $total+=$filaPrecio["precio"];
                    }
                    $reservas['total'] = $total;
                }
            }
            return $reservas;
        }
    }

    public function checkUserLogin($username,$password): bool{
        $db = $this->connect();

        $prepare = $db->prepare("SELECT * FROM user WHERE username = ? and password = ?");
        
        $prepare->bind_param('ss',$username,$password);    
        $prepare->execute();
        $user = $prepare->get_result();

        return $user->fetch_assoc()!=NULL;
    }

    public function selectRecursos(){
        $db = $this->connect();

        $prepare = $db->prepare("SELECT * FROM recurso");
        $prepare->execute();

        $recursos = array();
        $result = $prepare->get_result();

        while($r = mysqli_fetch_assoc($result)) {
            $recursos[$r["nombre"]] = $r["recurso_id"];
        }

        return $recursos;
    }

    public function selectRecursosNombres(){
        $db = $this->connect();

        $prepare = $db->prepare("SELECT * FROM recurso");
        $prepare->execute();

        $recursos = array();
        $result = $prepare->get_result();

        while($r = mysqli_fetch_assoc($result)) {
            $recursos[$r["recurso_id"]] = $r["nombre"];
        }

        return $recursos;
    }

}    
?>