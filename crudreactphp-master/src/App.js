import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl="http://localhost/apiPhpEscuela/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [trabajadorSeleccionado, settrabajadorSeleccionado]=useState({
    id: '',
    nombre: '',
    apellido: '',
    horas: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    settrabajadorSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(trabajadorSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("nombre", trabajadorSeleccionado.nombre);
    f.append("apellido", trabajadorSeleccionado.apellido);
    f.append("horas", trabajadorSeleccionado.horas);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("nombre", trabajadorSeleccionado.nombre);
    f.append("apellido", trabajadorSeleccionado.apellido);
    f.append("horas", trabajadorSeleccionado.horas);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: trabajadorSeleccionado.id}})
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(trabajador=>{
        if(trabajador.id===trabajadorSeleccionado.id){
          trabajador.nombre=trabajadorSeleccionado.nombre;
          trabajador.apellido=trabajadorSeleccionado.apellido;
          trabajador.horas=trabajadorSeleccionado.horas;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: trabajadorSeleccionado.id}})
    .then(response=>{
      setData(data.filter(trabajador=>trabajador.id!==trabajadorSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarTrabajador=(trabajador, caso)=>{
    settrabajadorSeleccionado(trabajador);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div style={{textAlign: 'center'}}>
<br />
      <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
      <br /><br />
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>apellido</th>
          <th>horas</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(trabajador=>(
          <tr key={trabajador.id}>
            <td>{trabajador.id}</td>
            <td>{trabajador.nombre}</td>
            <td>{trabajador.apellido}</td>
            <td>{trabajador.horas}</td>
          <td>
          <button className="btn btn-primary" onClick={()=>seleccionarTrabajador(trabajador, "Editar")}>Editar</button> {"  "}
          <button className="btn btn-danger" onClick={()=>seleccionarTrabajador(trabajador, "Eliminar")}>Eliminar</button>
          </td>
          </tr>
        ))}


      </tbody> 

    </table>


    <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar Trabajador</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
          <br />
          <label>apellido: </label>
          <br />
          <input type="text" className="form-control" name="apellido" onChange={handleChange}/>
          <br />
          <label>horas(de trabajo): </label>
          <br />
          <input type="text" className="form-control" name="horas" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>


    
    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar trabajador</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="nombre" onChange={handleChange} value={trabajadorSeleccionado && trabajadorSeleccionado.nombre}/>
          <br />
          <label>apellido: </label>
          <br />
          <input type="text" className="form-control" name="apellido" onChange={handleChange} value={trabajadorSeleccionado && trabajadorSeleccionado.apellido}/>
          <br />
          <label>horas: </label>
          <br />
          <input type="text" className="form-control" name="horas" onChange={handleChange} value={trabajadorSeleccionado && trabajadorSeleccionado.horas}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el trabajador {trabajadorSeleccionado && trabajadorSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
