import ReactDOM from "react-dom";
import React, { useState } from "react";
import axios from "axios";
import Garage from "./garage";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import img7 from "../images/7.png";
import img8 from "../images/8.png";
import img9 from "../images/9.png";
import img10 from "../images/10.png";
import img11 from "../images/11.png";
import img12 from "../images/12.png";
import img13 from "../images/13.png";

window.addEventListener("garage-loaded", start, false);

function start() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

const DVLA_API_URL = "http://localhost:3001/dvla-proxy";

const App = () => {
  const [cars, setCars] = useState(Garage.getAll());
  const [newCar, setNewCar] = useState({
    reg: "",
    model: "",
  });
  const [error, setError] = useState(""); // Error message
  const [open, setOpen] = useState(false);
  const [carInfo, setCarInfo] = useState({});
  const [openSuccess, setOpenSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openError, setOpenError] = useState(false);

  const randomNumber = Math.floor(Math.random() * 7) + 1;
  let image;

  switch (randomNumber) {
    case 1:
      image = img7;
      break;
    case 2:
      image = img8;
      break;
    case 3:
      image = img9;
      break;
    case 4:
      image = img10;
      break;
    case 5:
      image = img11;
      break;
    case 6:
      image = img12;
      break;
    case 7:
      image = img13;
      break;
    default:
      image = null;
  }

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleClose = () => {
    setOpen(false);
  };

  async function getCarDetailsFromAPI(registrationPlate) {
    try {
      const response = await axios.post(
        DVLA_API_URL,
        { registrationNumber: registrationPlate },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      setIsLoading(false);
      setTimeout(() => {
        setOpenError(false);
      }, 3000);
      return { error: error?.response?.data.errors[0].detail };
    }
  }

  const displayMoreContent = (e, carInfo) => {
    e.preventDefault();
    const map = new Map(Object.entries(carInfo));
    setCarInfo(map);
    setOpen(true);
  };

  const validateRegistrationPlate = (registrationPlate) => {
    // Use the provided regex pattern to match valid registration plates
    const regexPattern =
      /(^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$)|(^[A-Z][0-9]{1,3}[A-Z]{3}$)|(^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(^[0-9]{1,4}[A-Z]{1,2}$)|(^[0-9]{1,3}[A-Z]{1,3}$)|(^[A-Z]{1,2}[0-9]{1,4}$)|(^[A-Z]{1,3}[0-9]{1,3}$)|(^[A-Z]{1,3}[0-9]{1,4}$)|(^[0-9]{3}[DX]{1}[0-9]{3}$)/;

    if (registrationPlate.match(regexPattern)) {
      return true;
    }
    return false;
  };

  const updateNewCar = (field, value) => {
    setError(""); // Clear the error state if the registration plate is valid
    setNewCar({ ...newCar, [field]: value });
  };

  const addCarToGarage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (validateRegistrationPlate(newCar.reg)) {
      const response = await getCarDetailsFromAPI(newCar.reg);
      if (response) {
        if (response.error) {
          setOpenError(true);
          return;
        }
        const car = {
          reg: response.registrationNumber,
          make: response.make,
          model: newCar.model,
          year: response.yearOfManufacture,
          image: image,
          moreInfo: response,
        };
        Garage.add(car);
        setCars(Garage.getAll());
        setNewCar({
          reg: "",
          make: "",
          model: "",
          imageUrl: "",
          year: "",
        });
        setError(""); // Clear the error state if the registration plate is valid
        setOpenSuccess(true);
      } else {
        setError("Something went wrong! Please try again later!");
      }
    } else {
      setError("Invalid registration plate. Please try again.");
    }
    setIsLoading(false);
    setTimeout(() => {
      setOpenSuccess(false);
      setOpenError(false);
    }, 3000);
  };

  return (
    <Box>
      <Typography
        gutterBottom
        variant="h3"
        component="div"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        Car Registration
      </Typography>
      <Divider style={{ margin: "20px" }} />
      {/* Form for adding new cars */}
      <Collapse in={openSuccess}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Successfully registered a Car!
        </Alert>
      </Collapse>
      <Collapse in={openError}>
        <Alert severity="error" sx={{ width: "100%" }}>
          Record for vehicle not found!
        </Alert>
      </Collapse>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
          marginTop: "20px",
          textAlign: "center",
        }}
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          required
          label="Enter registration plate"
          variant="outlined"
          value={newCar.reg}
          onChange={(e) => updateNewCar("reg", e.target.value)}
        />
        <TextField
          id="outlined-basic"
          required
          label="Enter car model"
          variant="outlined"
          value={newCar.model}
          onChange={(e) => updateNewCar("model", e.target.value)}
        />

        <Box
          textAlign="center"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0px",
            margin: "auto",
            marginTop: "20px",
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              type="submit"
              disabled={newCar.reg.length === 0 || newCar.model.length === 0}
              variant="contained"
              onClick={addCarToGarage}
              style={{ display: "inline-grid" }}
            >
              Add Car
            </Button>
          )}
        </Box>
      </Box>
      {error && (
        <Typography
          variant="body1"
          color="error"
          align="center"
          style={{ marginTop: "10px" }}
        >
          {error}
        </Typography>
      )}

      <Divider style={{ margin: "20px" }} />
      {open && (
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography gutterBottom variant="h6" component="div">
                Lets learn more about this car
              </Typography>
              <Divider />
              <List>
                {Array.from(carInfo).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText primary={key} secondary={value} />
                  </ListItem>
                ))}
              </List>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close Details</Button>
          </DialogActions>
        </Dialog>
      )}

      <Grid container spacing={2} className="cars-container">
        {cars
          .filter((car) => car.reg)
          .map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.reg + car.model}>
              <Card sx={{ minWidth: "30%", margin: "20px" }}>
                <CardMedia
                  component="img"
                  alt="car image"
                  height="140"
                  image={car.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {car.make}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {car.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {car.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {car.reg}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={(e) => displayMoreContent(e, car.moreInfo)}
                  >
                    More Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
