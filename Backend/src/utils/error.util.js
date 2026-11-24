/*
Clase personalizada para errores controlados de la aplicación.
Permite adjuntar un código de estado HTTP (status) junto al mensaje.
*/
class ServerError extends Error {
    constructor(message, status = 500) {
        super(message)
        this.status = status
    }
}

export default ServerError
