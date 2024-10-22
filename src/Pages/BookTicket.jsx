import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { config } from "../config";

function BookTicket() {
  let navigate = useNavigate();
  let [price, setPrice] = useState(localStorage.getItem("price"));
  let addFood = (offer) => {
    let ele = document.getElementById("food");

    if (ele.checked == true) {
      setPrice(20 - (20 * offer) / 100 + +price);
    } else {
      setPrice(price - (20 - (20 * offer) / 100));
    }
  };
  let BookNow = async () => {
    let req = {
      from: `${localStorage.getItem("from")}`,
      to: `${localStorage.getItem("to")}`,
      price: price,
      date: `${localStorage.getItem("date")}`,
      airline: `${localStorage.getItem("item")}`,
      food: document.getElementById("food").checked,
    };
    try {
      let res = await axios.post(
        `${config.api}/api/ticket/book-ticket/${localStorage.getItem(
          "userid"
        )}`,
        req,
        {
          headers: {
            Authorization: `${localStorage.getItem("react_app_token")}`,
          },
        }
      );
      alert(res.data.message);
      console.log(res.data);
      navigate(
        `/ticket/${localStorage.getItem("userid")}/${res.data.savedTicket._id}`
      );
    } catch (error) {
      alert("Duplicate Ticket/Something Went wrong");
      console.log(error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div class="card">
          <h5 class="card-header">
            Booking Tickets on {`${localStorage.getItem("item")}`}
          </h5>
          <div class="card-body">
            <h5 class="card-title">{`From ${localStorage.getItem(
              "from"
            )} to ${localStorage.getItem("to")}`}</h5>
            <h5>Date:{`${localStorage.getItem("date")}`} </h5>
            <input
              type="checkbox"
              name="food"
              id="food"
              onChange={() => addFood(localStorage.getItem("offer"))}
            />
            <label for="food">Check Here to add Food ($20/per person)</label>
            {localStorage.getItem("offer") != 0 ? (
              <>
                <p class="card-text">
                  <span className="offer">Offer</span>{" "}
                  {`You have ${localStorage.getItem("offer")}% offer on Foods`}
                </p>
              </>
            ) : (
              <p>Order Foods</p>
            )}

            <h5>Total Ticket Price : ${price}</h5>
            <a href="#" class="btn btn-primary" onClick={() => BookNow()}>
              Book Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookTicket;
