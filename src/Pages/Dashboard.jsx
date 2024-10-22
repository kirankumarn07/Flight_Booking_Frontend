import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { RiArrowUpDownLine } from "react-icons/ri";
import { airports, airlines } from "../airports";
import Card from "../Components/Card";
import Navbar from "../Components/Navbar";
import { config } from "../config";

function Dashboard() {
  let [display, setDisplay] = useState("d-none");
  var airline = [];
  let [price, setPrice] = useState(200);
  let [offer, setOffer] = useState(0);
  for (let i = 0; i < 3; i++) {
    airline[i] = airlines[Math.floor(Math.random() * airlines.length)];
  }
  let showFlight = () => {
    setDisplay("d-block");
    document.querySelector("#date").setAttribute("disabled", true);
  };
  // console.log(today >= '10/26/2022' );
  let showDate = () => {
    setPrice(200);
    setDisplay("d-none");
    document.querySelector("#date").removeAttribute("disabled");
  };
  let changeTab = () => {
    let temp = "",
      temp2;
    let one = document.querySelector("#from");
    let two = document.querySelector("#to");
    temp = one.value;
    one.value = two.value;
    two.value = temp;
    temp2 = formik.values.from;
    formik.values.from = formik.values.to;
    formik.values.to = temp2;
  };
  let calculateOffer = (offer) => {
    if (!(offer == 0)) setPrice(price - (price * offer) / 100);
  };

  const formik = useFormik({
    initialValues: {
      from: "",
      to: "",
      date: "",
      checkDate: "",
    },
    validate: (values) => {
      let errors = {};
      if (!values.from) {
        errors.from = "Please enter from";
      }
      if (!values.to) {
        errors.to = "Please enter to";
      }
      if (!values.date) {
        errors.date = "Please enter date";
      }

      if (values.from === values.to) {
        errors.from = "From and To place should be different";
      }

      console.log(errors);
      return errors;
    },
    onSubmit: async (values) => {
      console.log(values);
      try {
        let res = await axios.post(`${config.api}/api/date/dashboard`, values, {
          headers: {
            Authorization: `${localStorage.getItem("react_app_token")}`,
          },
        });
        console.log(res.data);
        alert(res.data.message);
        showFlight();
        setPrice(200);
        setOffer(res.data.offer);
        calculateOffer(res.data.offer);
      } catch (error) {
        alert("Date Should not be lesserthan today");
        console.log(error);
      }
    },
  });
  return (
    <>
      <Navbar />

      <div className="container-fluid d-flex justify-content-center mt-5"
            style={{
              backgroundImage: `url('https://d1zhyf4obee6da.cloudfront.net/s3fs-public/2021-03/Flight%20Booking%20App.jpg')`, // Add your image URL here
              backgroundSize: "cover", // Makes the image cover the entire container
              backgroundPosition: "center", // Centers the image
              height: "1000px", // Set the height to cover the viewport
              padding:"5px"
            }}
      >
        {/* <div className="row fs-3 center">Flight</div> */}
        <div className="container mt-5">
        <div className="row">
          <div className="col  d-flex justify-content-center">
            <form className="container" onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col d-flex flex-column">
                  <div className=" d-flex flex-column">
                    <label for="from">From</label>
                    <select
                      name="from"
                      className="rounded m-5"
                      id="from"
                      onChange={formik.handleChange}
                      value={formik.values.from}
                    >
                      <option value={"none"}>From</option>
                      {airports.map((airport) => {
                        return (
                          <option
                            value={`${airport.city}`}
                          >{`${airport.city}`}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col d-flex justify-content-center">
                      <RiArrowUpDownLine
                        className="border rounded fs-2 pointer"
                        onClick={() => changeTab()}
                      />
                    </div>
                  </div>
                  <div className=" d-flex flex-column">
                    <label for="to">To</label>

                    <select
                      name="to"
                      className="rounded m-5"
                      id="to"
                      onChange={formik.handleChange}
                      value={formik.values.to}
                    >
                      <option value={"none"}>To</option>
                      {airports.map((airport) => {
                        return (
                          <option
                            value={`${airport.city}`}
                          >{`${airport.city}`}</option>
                        );
                      })}
                    </select>
                  </div>
                  {formik.errors.from ? (
                    <span className="text-danger">{formik.errors.from}</span>
                  ) : null}
                </div>
              </div>
              <div className="row m-5">
                <div className="col d-flex justify-content-center">
                  <label for="date" className="fs-5" >
                    Select Date:
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    onChange={formik.handleChange}
                    value={formik.values.date}
                  />
                  <button
                    type="button"
                    onClick={() => showDate()}
                    className={`btn btn-warning ${display}`}
                  >
                    Change Date
                  </button>
                </div>
                {formik.errors.checkDate ? (
                  <span className="text-danger">{formik.errors.checkDate}</span>
                ) : null}
              </div>

              <div className="row ">
                <div className="col d-flex justify-content-center">
                  <button className="btn btn-success " type="submit">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div
            className={`col  d-flex justify-content-center flex-column  flight ${display}`}
          >
            <div className="container">
              <div className="row">
                <div className="fs-3">Available Flights/Airlines</div>
              </div>
            </div>
            <div className="container">
              {airline.map((item) => {
                return (
                  // <div className="row mt-5">
                  //   <div class="card text-center">
                  //     <div class="card-header airlines">{item}</div>
                  //     <div class="card-body">
                  //       <h5 class="card-title">{`${formik.values.from} --✈-> ${formik.values.to}`}</h5>
                  //       <p class="card-text">
                  //         By applying {offer}% offer Price: ${price}
                  //       </p>
                  //       <a href="#" class="btn btn-primary">
                  //         Book Ticket
                  //       </a>
                  //     </div>
                  //     <div class="card-footer text-muted">{`${formik.values.date}`}</div>
                  //   </div>
                  // </div>
                  <Card
                    item={item}
                    from={formik.values.from}
                    to={formik.values.to}
                    offer={offer}
                    price={price}
                    date={formik.values.date}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
      
    </>
  );
}

export default Dashboard;
