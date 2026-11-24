import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

/*
Genera un hash irreversible a partir de una contraseña en texto plano
*/
export async function generateHash(password) {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

/*
Compara una contraseña en texto plano contra el hash guardado en la base de datos
*/
export async function compareHash(password, hash) {
    return await bcrypt.compare(password, hash)
}
