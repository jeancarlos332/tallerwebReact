import React from 'react'
import { nanoid } from 'nanoid'
import { firebase } from '../firebase'

const Main = () => {
    const [nombre, setNombre] = React.useState('')
    const [apellido, setApellido] = React.useState('')
    const [cedula, setCedula] = React.useState('')
    const [cargo, setCargo] = React.useState('')
    const [edad, setEdad] = React.useState([])
    const [imagenAleatoria] = React.useState([])
    const [listaEmpleados, setlistaEmpleados] = React.useState([])
    const [id, setId] = React.useState('')
    const [modoEdicion, setModoEdicion] = React.useState(false)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const db = firebase.firestore()
                const data = await db.collection('empleados').get()
                const arrayData = data.docs.map(item => (
                    {
                        id: item.id, ...item.data()
                    }
                ))
                setlistaEmpleados(arrayData)
            } catch (error) {
                console.log(error)
            }
        }

        obtenerDatos();
    })


    const guardarEmpleados = async (e) => {
        e.preventDefault()

        if (!nombre.trim()) {
            setError('Digite el nombre')
            return
        }
        if (!apellido.trim()) {
            setError('Digite el apellido')
            return
        }
        if (!cedula.trim()) {
            setError('Digite la cédula')
            return
        }

        if (!cargo.trim()) {
            setError('Digite el cargo')
            return
        }
        if (!edad.trim()) {
            setError('Digite la edad')
            return
        }

        try {
            const db = firebase.firestore()
            const nuevaCarrera = {
                nombre: nombre,
                apellido: apellido,
                cedula: cedula,
                cargo: cargo,
                edad: edad,
                img: imagenAleatoria
            }

            await db.collection('empleados').add(nuevaCarrera)

            setlistaEmpleados([
                ...listaEmpleados,
                {
                    id: nanoid(),
                    nombre: nombre,
                    apellido: apellido,
                    cedula: cedula,
                    cargo: cargo,
                    edad: edad,
                    img: imagenAleatoria
                }
            ])

            e.target.reset()
            setNombre('')
            setApellido('')
            setCedula('')
            setCargo('')
            setEdad('')
            setError(null)
        } catch (error) {
            console.log(error)
        }

    }

    const editar = item => {
        setNombre(item.nombre)
        setApellido(item.apellido)
        setCedula(item.cedula)
        setCargo(item.cargo)
        setEdad(item.edad)
        setModoEdicion(true)
        setId(item.id)
    }
    const editarEmpleados = async e => {
        e.preventDefault()

        if (!nombre.trim()) {
            setError('Digite el nombre')
            return
        }
        if (!apellido.trim()) {
            setError('Digite el apellido')
            return
        }
        if (!cedula.trim()) {
            setError('Digite la cédula')
            return
        }
        if (!cargo.trim()) {
            setError('Digite el cargo')
            return
        }
        if (!edad.trim()) {
            setError('Digite la edad')
            return
        }

        try {
            const db = firebase.firestore()
            await db.collection('empleados').doc(id).update({
                nombre: nombre,
                apellido: apellido,
                cedula: cedula,
                cargo: cargo,
                edad: edad
            })
            const arrayEditado = listaEmpleados.map(
                item => item.id === id ? {
                    id: id, nombre: nombre,
                    apellido: apellido,
                    cedula: cedula,
                    cargo: cargo,
                    edad: edad
                } : item
            )

            setlistaEmpleados(arrayEditado)
            setNombre('')
            setApellido('')
            setCedula('')
            setCargo('')
            setEdad('')
            setModoEdicion(false)
            setError(null)

        } catch (error) {
            console.log(error)
        }

    }
    const eliminar = async id => {
        try {
            const db = firebase.firestore()
            await db.collection('empleados').doc(id).delete()
            const aux = listaEmpleados.filter(item => item.id !== id)
            setlistaEmpleados(aux)
        } catch (error) {
            console.log(error)
        }


    }

    const cancelar = () => {
        setModoEdicion(false)
        setNombre('')
        setApellido('')
        setCedula('')
        setCargo('')
        setEdad('')
        setId('')
        setError(null)
    }

    return (
        <div className='container mt-5'>
            <h1 className='text-center'>CRUD EMPLEADOS</h1>
            <hr />
            <div className='row'>
                <div className='col-8'>
                    <h4 className='text-center'>Listado de empleados</h4>
                    <ul className='list-group'>
                        {
                            listaEmpleados.map(item => (

                                <table className="table table-striped" key={item.id}>
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col-4">Nombre</th>
                                            <th scope="col-4">Apellido</th>
                                            <th scope="col-4">Cédula</th>
                                            <th scope="col-4">Cargo</th>
                                            <th scope="col-4">Edad</th>
                                            <th scope="col-4">Imagen aleatoria</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="row-4">{item.nombre}</td>
                                            <td className="row-4"> {item.apellido}</td>
                                            <td className="row-4">{item.cedula}</td>
                                            <td className="row-4">{item.cargo}</td>
                                            <td className="row-4">{item.edad}</td>
                                            <td className="row-4"><img
                                                alt={item.nombre}
                                                src={`https://picsum.photos/200/200?random&t=${item.id}`}
                                            /></td>
                                            <td>       <button className='btn btn-danger btn-sm float-end mx-2' onClick={() => eliminar(item.id)}>
                                                Eliminar
                                            </button>
                                                <button className='btn btn-warning btn-sm float-end mx-2' onClick={() => editar(item)}>
                                                    Editar
                                                </button></td>
                                        </tr>
                                    </tbody>
                                </table>


                            ))
                        }
                    </ul>

                </div>
                <div className='col-3'>
                    <h4 className='text-center'>
                        {
                            modoEdicion ? 'Editar Empleados' : 'Agregar Empleados'
                        }
                    </h4>
                    <form onSubmit={modoEdicion ? editarEmpleados : guardarEmpleados}>
                        {
                            error ? <span className='text-danger'>{error}</span> : null
                        }
                        <input
                            className='form-control mb-2'
                            type="text"
                            placeholder='Ingrese nombre'
                            onChange={(e) => setNombre(e.target.value)}
                            value={nombre}
                        />
                        <input
                            className='form-control mb-2'
                            placeholder='Ingrese apellido'
                            type="text"
                            onChange={(e) => setApellido(e.target.value)}
                            value={apellido}
                        />
                        <input
                            className='form-control mb-2'
                            placeholder='Ingrese cédula'
                            type="text"
                            onChange={(e) => setCedula(e.target.value)}
                            value={cedula}
                        />

                        
                        <input
                            className='form-control mb-2'
                            placeholder='Ingrese cargo'
                            type="text"
                            onChange={(e) => setCargo(e.target.value)}
                            value={cargo}
                        />

                        <input
                            className='form-control mb-2'
                            placeholder='Ingrese edad'
                            type="text"
                            onChange={(e) => setEdad(e.target.value)}
                            value={edad}
                        />
                        {
                            modoEdicion ?
                                (
                                    <>
                                        <button
                                            className='btn btn-warning btn-block'
                                            type='submit'
                                        >Editar</button>
                                        <button
                                            className='btn btn-dark btn-block mx-2'
                                            onClick={() => cancelar()}
                                        >Cancelar</button>
                                    </>
                                )
                                :
                                <button
                                    className='btn btn-primary btn-block'
                                    type='submit'
                                >Agregar</button>
                        }
                        
                    </form>
                </div>
            </div>
        </div>

    )
}
export default Main