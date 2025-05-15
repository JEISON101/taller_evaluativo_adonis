import client from "../database/pgDatabase.js";
import { HttpContext } from "@adonisjs/core/http";

export default class LibrosController {

    async getLibros({ response }: HttpContext) {
        try {
            const result = await client.query('SELECT l.*, e.nombre as editorial FROM libros l INNER JOIN editoriales e ON l.editorial_id = e.id_editorial')
            if (result) {
                return response.status(200).json({ datos: result })
            } else {
                return response.status(404).json({ mensaje: 'ERROR 404, los libros no fueron encontrados' })
            }
        } catch (error) {
            return response.status(500).json({ mensaje: 'ERROR, problemas en el servidor', error: error })
        }
    }

    async getLibroId({params, response}:HttpContext){
        const id = params.id;
        const resuts = await client.query('SELECT * FROM libros WHERE id_libro = $1', [id])
        return response.status(200).json({mensaje: 'BUSQUEDA EXITOSA', editorial: resuts.rows})
    }

    async postLibro({ request, response }: HttpContext) {
        const { titulo, autor, anio_publicacion, editorial_id } = request.body();
        const consulta: string = 'INSERT INTO libros (titulo, autor, anio_publicacion, editorial_id) VALUES ($1, $2, $3, $4)';
        return response.json({mensaje: verificarDatosLibro(titulo, autor, anio_publicacion, editorial_id, consulta)})
    }

    async putLibro({ params, request, response }: HttpContext) {
        const id = params.id;
        const { titulo, autor, anio_publicacion, editorial_id } = request.body();
        const consulta: string = 'UPDATE libros SET titulo = $1, autor = $2 , anio_publicacion = $3, editorial_id =$4 WHERE id_libro = $5';
        return response.json({mensaje: verificarDatosLibro(titulo, autor, anio_publicacion, editorial_id, consulta, id)})
    }

    async deleteLibro({ params, response }: HttpContext) {
            const id = params.id;
            await client.query('DELETE FROM libros WHERE id_libro=$1', [id])
            return response.status(200).json({mensaje:'LIBRO ELIMINADO EXITOSAMENTE'}) 
        }

    }

async function verificarDatosLibro(
  titulo: string,
  autor: string,
  anio_publicacion: number,
  editorial_id: number,
  consulta: string,
  id?: number
): Promise<string> {
  if (!titulo || !autor || !anio_publicacion || !editorial_id) {
    return 'Todos los parámetros son necesarios';
  }

  if (anio_publicacion.toString().length !== 4) {
    return 'El año de publicación debe tener 4 dígitos';
  }

  try {
    const params = id !== undefined
      ? [titulo, autor, anio_publicacion, editorial_id, id]
      : [titulo, autor, anio_publicacion, editorial_id];

    await client.query(consulta, params);
    return 'EJECUCIÓN EXITOSA';
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    return 'Error en la ejecución de la consulta';
  }
}
