import EditorialesController from '#controllers/EditorialesController'
import LibrosController from '#controllers/LibrosController'
import router from '@adonisjs/core/services/router'

const editoriales = new EditorialesController();
const libros = new LibrosController();

// rutas para las editoriales
router.get('/editoriales', editoriales.getEditoriales)
router.get('/editorial/:id', editoriales.getEditorialId)
router.post('/editorial', editoriales.postEditorial)
router.put('/editorial/:id', editoriales.putEditorial)
router.delete('/editorial/:id',editoriales.deleteEditorial)
router.get('/editorial/:id/libros', editoriales.getLibrosEditorial)

//rutas para los libros
router.get('/libros', libros.getLibros)
router.get('/libro/:id', libros.getLibroId)
router.post('/libro', libros.postLibro)
router.put('/libro/:id', libros.putLibro)
router.delete('/libro/:id', libros.deleteLibro)
