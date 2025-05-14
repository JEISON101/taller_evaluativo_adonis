import { HttpContext } from "@adonisjs/core/http"
import client from "../database/pgDatabase.js"

export default class EditorialesController {
    async getEditoriales({ response }: HttpContext) {
        try {
            const result = await client.query('SELECT * FROM editoriales')
            if (result) {
                return response.status(200).json({ datos: result.rows })
            } else {
                return response.status(404).json({ mensaje: 'ERROR 404, las editoriales no fueron encontradas' })
            }
        } catch (error) {
            return response.status(500).json({ mensaje: 'ERROR, problemas en el servidor', error: error })
        }
    }
    
    async getEditorialId({params, response}:HttpContext){
        const id = params.id;
        const resuts = await client.query('SELECT * FROM editoriales WHERE id_editorial = $1', [id])
        return response.status(200).json({mensaje: 'BUSQUEDA EXITOSA', editorial: resuts.rows})
    }

    async postEditorial({ request, response }: HttpContext) {
        const { nombre, pais } = request.body();
        const consulta: string = 'INSERT INTO editoriales (nombre, pais) VALUES ($1, $2)';
        return response.json({consulta: verficarDatosEditorial(nombre, pais, consulta)})
    }

    async putEditorial({ params, request, response }: HttpContext) {
        const id = params.id;
        const { nombre, pais } = request.body();
        const consulta: string = 'UPDATE editoriales SET nombre = $1, pais = $2 WHERE id_editorial = $3';
        return response.json({mensaje: verficarDatosEditorial(nombre, pais, consulta, id)})
    }
    
    async deleteEditorial({ params, response }: HttpContext) {
            const id = params.id;
            await client.query('DELETE FROM editoriales WHERE id_editorial=$1', [id])
            return response.status(200).json({mensaje:'EDITORIAL ELIMINADA EXITOSAMENTE'}) 
        }

        
        async getLibrosEditorial({params, response}:HttpContext){
            const id = params.id
            const result = await client.query('SELECT e.nombre, l.titulo FROM editoriales e JOIN libros l ON l.editorial_id = e.id_editorial WHERE l.editorial_id = $1', [id])
            return response.status(200).json({libros: result.rows})
        }
        
    }

        async function verficarDatosEditorial(nombre: string, pais: string, consulta: string, id?:number){
            if (nombre && pais) {
                if (nombre != null && pais != null) {
                    await client.query(consulta, [nombre, pais, id])
                    return 'EJECUCION EXITOSA'
                } else {
                    return 'Todos los valores de los parámetros son necesarios' 
                }
            } else {
                return 'Todos los parámetros son necesarios'
            }
        }
        
