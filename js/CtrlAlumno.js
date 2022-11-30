import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraAlumnos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoAlumno =
  getFirestore().
    collection("Alumno");
const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc =
      await daoAlumno.
        doc(id).
        get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Alumno} */
      const data = doc.data();
      forma.codigo.value = data.codigo;
      forma.marca.value = data.marca || "";
      forma.precio.value = data.precio || "";
      forma.color.value = data.color || "";
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraAlumnos();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const codigo = getString(
        formData, "codigo").trim();  
    const  marca = getString(formData, "marca").trim();
    const precio = getString(formData, "precio").trim();
    const color = getString(formData, "color").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      codigo, 
      marca,
      precio,
      color,
    };
    await daoAlumno.
      doc(id).
      set(modelo);
    muestraAlumnos();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoAlumno.
        doc(id).
        delete();
      muestraAlumnos();
    }
  } catch (e) {
    muestraError(e);
  }
}

