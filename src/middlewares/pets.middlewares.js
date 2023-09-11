const { body } = require("express-validator");
const { Pet } = require("../models/pets.models");
const { validSpecies } = require("./patients.middlewares");

const newPetValidator = () => {
  const inputNames = [
    { title: "Mascota", name: "name" },
    { title: "Raza", name: "race" },
  ];

  const validatorList = inputNames.map((el) =>
    body(el.name)
      .toLowerCase()
      .trim()
      .not()
      .isEmpty()
      .withMessage(el.title + " es un campo obligatorio.")
      .isString()
      .withMessage(el.title + " solo tipo string")
      .isLength({ min: 3, max: 35 })
      .withMessage(el.title + " debe ser mayor a 3 caracteres y menor que 35.")
      .matches(/^[\w\-\s]+$/)
      .withMessage(el.title + " solo acepta letras y números.")
      .escape(),
  );
  validatorList.push(
    body("specie")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Especie es un campo obligatorio.")
      .toLowerCase()
      .isIn(validSpecies)
      .withMessage("Tipo de mascota no soportado.")
      .escape(),
  );
  return validatorList;
};

const checkIfAPetAlreadyExist = async (req, res, next) => {
  try {
    const data = req.body;
    const foundedPet = await Pet.findOne({
      name: data.name,
      specie: data.specie,
    });
    if (foundedPet) {
      res.status(400).json({
        success: false,
        message: "La mascota ya se encuentra registrado en el sistema.",
      });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkIfAPetAlreadyExist, newPetValidator };
