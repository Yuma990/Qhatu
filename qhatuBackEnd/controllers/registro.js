'use strict';

const Comerciante = require('../models/comerciante');
const Consumidor = require('../models/consumidor');
const Tienda = require('../models/tienda');
const bcrypt = require('bcrypt');

exports.registrarComerciante = async (req, res) => {
  const params = req.body;
  const contacto = params.contacto;
  const contraseña = params.contraseña;
  const nombre = params.nombre;
  const nombreTienda = params.nombreTienda;
  const nombreUsuario = params.nombreUsuario;
  // 1/2/21 mod
  var datetime = new Date();
  const fCreacion = {
    dia: datetime.getDate(),
    mes: datetime.getMonth(),
    año: datetime.getFullYear(),
  };
  const imagencomerciante = params.imagen;
  // 1/2/21 mod
  const categoria = params.categoria;
  const imagen = params.imagen;
  const informacionPuesto = params.informacionPuesto;
  const numeroPuesto = params.numeroPuesto;

  try {
    const comerciante = new Comerciante();
    comerciante.contacto = contacto;
    comerciante.nombre = nombre;
    comerciante.nombreUsuario = nombreUsuario;
    comerciante.nombreTienda = nombreTienda;
    // 1/2/21 mod
    comerciante.imagen = imagencomerciante;
    comerciante.fCreacion = fCreacion;
    // 1/2/21 mod
    const unicoComerciante = await Comerciante.findOne({ nombreUsuario });
    if (unicoComerciante) {
      return res.status(200).json({
        ok: false,
        unico: false,
        response: 'El usuario ya existe.',
      });
    }
    const hash = bcrypt.hashSync(contraseña, 10);
    comerciante.contraseña = hash;

    const nuevoComerciante = await comerciante.save();

    const tienda = new Tienda();
    tienda.categoria = categoria;
    tienda.comercianteId = nuevoComerciante._id;
    tienda.imagen = imagen;
    tienda.informacionPuesto = informacionPuesto;
    tienda.numeroPuesto = numeroPuesto;
    const nuevaTienda = await tienda.save();

    const comercianteActualizado = await Comerciante.findByIdAndUpdate(
      nuevoComerciante._id,
      { tiendaId: nuevaTienda._id },
      { new: true }
    ).exec();
    return res.status(200).json({
      ok: true,
      comerciante: comercianteActualizado,
      tienda: nuevaTienda,
    });
  } catch (exception) {
    console.log(exception);
    return res.status(500).json({
      ok: false,
      message: `${exception}`,
    });
  }
};

exports.registrarConsumidor = async (req, res) => {
  const params = req.body;
  const nombre = params.nombre;
  const nombreUsuario = params.nombreUsuario;
  const contraseña = params.contraseña;
  const imagen = params.imagen;

  try {
    const consumidor = new Consumidor();
    consumidor.nombre = nombre;
    consumidor.nombreUsuario = nombreUsuario;
    consumidor.imagen = imagen;
    const unicoConsumidor = await Consumidor.findOne({ nombreUsuario });
    if (unicoConsumidor) {
      return res.status(200).json({
        ok: false,
        unico: false,
        response: 'El usuario ya existe.',
      });
    }

    const hash = bcrypt.hashSync(contraseña, 10);
    consumidor.contraseña = hash;

    const nuevoConsumidor = await consumidor.save();

    return res.status(200).json({
      ok: true,
      message: nuevoConsumidor,
    });
  } catch (exception) {
    return res.status(500).json({
      ok: false,
      message: `${exception}`,
    });
  }
};
