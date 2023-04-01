import img1 from "../images/1.png";
import img2 from "../images/2.png";
import img3 from "../images/3.png";
import img4 from "../images/4.png";
import img5 from "../images/5.png";
import img6 from "../images/6.png";
const garage = {
  count: 3,
  cars: [
    {
      reg: "AA19 AAA",
      make: "Mercedes",
      model: "A4",
      year: "2022",
      image: img1,
      moreInfo: moreInfo,
    },
    {
      reg: "AA19EEE",
      make: "BMW",
      model: "M3",
      year: "2022",
      image: img2,
      moreInfo: moreInfo,
    },
    {},
  ],
};

const moreInfo = {
  registrationNumber: "AA19AAA",
  taxStatus: "Taxed",
  taxDueDate: "2023-07-01",
  motStatus: "Valid",
  make: "MERCEDES-BENZ",
  yearOfManufacture: 2019,
  engineCapacity: 1332,
  co2Emissions: 126,
  fuelType: "PETROL",
  markedForExport: false,
  colour: "WHITE",
  typeApproval: "M1",
  revenueWeight: 1945,
  euroStatus: "EURO 6 DG",
  dateOfLastV5CIssued: "2020-07-17",
  motExpiryDate: "2023-07-18",
  wheelplan: "2 AXLE RIGID BODY",
  monthOfFirstRegistration: "2019-07",
};

const _registrationPlates = [
  {
    make: "Audi",
    model: "A4",
    year: "2022",
    image: img1,
    moreInfo: moreInfo,
  },
  {
    make: "BMW",
    model: "M3",
    year: "2022",
    image: img2,
    moreInfo: moreInfo,
  },
  {
    make: "Ford",
    model: "Mustang",
    year: "2022",
    image: img3,
    moreInfo: moreInfo,
  },
  {
    make: "Honda",
    model: "Civic",
    year: "2022",
    image: img4,
    moreInfo: moreInfo,
  },
  {
    make: "Toyota",
    model: "Camry",
    year: "2022",
    image: img5,
    moreInfo: moreInfo,
  },
  {
    make: "Volkswagen",
    model: "Jetta",
    year: "2022",
    image: img6,
    moreInfo: moreInfo,
  },
];

const Garage = {
  add(value) {
    if (value.reg) {
      garage.count++;
      if (
        !value.make &&
        !value.model &&
        !value.year &&
        !value.image &&
        !value.moreInfo
      ) {
        garage.cars.push({
          ...value,
          ..._registrationPlates[garage.count - 2],
        });
      } else {
        garage.cars.push(value);
      }
    }
  },
  delete(reg) {
    garage.count--;
    garage.cars = garage.cars.filter((plate) => plate?.reg !== reg);
  },
  get(reg) {
    return garage.cars.filter((plate) => plate?.reg === reg);
  },

  getAll() {
    return garage.cars;
  },
};

export default Garage;
