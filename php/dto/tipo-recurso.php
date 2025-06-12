<?php
class TipoRecurso
{
    private int $tipoId;
    private string $nombre;

    public function __construct(int $tipoId,string $nombre) {
        $this->tipoId = $tipoId;
        $this->nombre = $nombre;
    }

    public function getId(): int
    {
        return $this->tipoId;
    }

    public function getNombre(): string
    {
        return $this->nombre;
    }
}
?>