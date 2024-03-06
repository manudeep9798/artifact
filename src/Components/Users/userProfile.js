import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import Input from "../input/input";
import { genderOptions } from "../../constants/constants";
import axios from "axios";
import mockResponse from "./mockResopnse.json";

const UserProfile = () => {
  const [data, setData] = useState();

  //funtion to update the state
  const handleChange = useCallback(
    (type, value) => {
      if (type === "age" && value < 0) {
        return;
      }
      setData({
        ...data,
        [type]: value,
      });
    },
    [data]
  );

  // auto save the input data with debouncing
  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      window.localStorage.setItem("UserProfile", JSON.stringify(data));
    }, 2000);
    return () => clearTimeout(timer);
  }, [data]);

  // manually save the data
  const handleSubmit = (e) => {
    e.preventDefault();
    window.localStorage.setItem("UserProfile", JSON.stringify(data));
    alert("Data updated succesfully!!");
  };

  //Fetch  email , display_name , username , avatar_uri from given end point
  const fetchDataFromProfile = () => {
    const authToken = "new-token";
    axios
      .get("https://api-staging-0.gotartifact.com/v2/users/me", {
        headers: {
          Authorization: authToken,
        },
      })
      .then((res) => {
        const { email, display_name, username, avatar_uri } = res.profile;
        setData((prevState) => ({
          ...prevState,
          email: email,
          display_name: display_name,
          username: username,
          avatar_uri: avatar_uri,
        }));
      })
      .catch((err) => {
        const { email, display_name, username, avatar_uri } =
          mockResponse.profile;
        setData((prevState) => ({
          ...prevState,
          email: email,
          display_name: display_name,
          username: username,
          avatar_uri: avatar_uri,
        }));
      });
  };

  // fetch data stored in local storage and geo location
  const getData = async () => {
    let localData = await window.localStorage.getItem("UserProfile");
    if (localData) {
      localData = JSON.parse(localData);
      setData(localData);
    }
    await axios
      .get(
        "https://ipgeolocation.abstractapi.com/v1/?api_key=" +
          process.env.REACT_APP_GEO_KEY
      )
      .then((res) => {
        setData((prevState) => ({
          ...prevState,
          location: res.data.city,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
    await fetchDataFromProfile();
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="profile-container">
      <div className="modal-box">
        <h1 className="w-100p">Create User Profile</h1>
        <Input
          initialValue={data?.name}
          type="text"
          inputType="name"
          placeHolder="Name"
          onChange={handleChange}
        />
        <Input
          initialValue={data?.email}
          type="text"
          inputType="email"
          placeHolder="Email"
          onChange={handleChange}
        />
        <Input
          initialValue={data?.username}
          type="text"
          inputType="username"
          placeHolder="User Name"
          onChange={handleChange}
        />
        <Input
          initialValue={data?.display_name}
          type="text"
          inputType="display_name"
          placeHolder="Display Name"
          onChange={handleChange}
        />
        <Input
          initialValue={data?.interest1}
          type="text"
          inputType="interest1"
          placeHolder="interest 1"
          onChange={handleChange}
        />
        <Input
          initialValue={data?.interest2}
          type="text"
          inputType="interest2"
          placeHolder="interest 2"
          onChange={handleChange}
        />
        <Input
          initialValue={data?.avatar_uri}
          type="text"
          inputType="avatar_uri"
          placeHolder="Avatar URI"
          onChange={handleChange}
        />
        <Input
          initialValue={data?.age}
          type="number"
          inputType="age"
          placeHolder="Age"
          onChange={handleChange}
        />
        <Input
          initialValue={data?.interest2}
          type="select"
          selectOptions={genderOptions}
          inputType="gender"
          placeHolder="Gender"
          onChange={handleChange}
        />
        <Input
          classnames="flex-2 pr-12"
          initialValue={data?.location}
          type="text"
          inputType="location"
          placeHolder="Location"
          onChange={handleChange}
        />
        <button
          className="w-100p c-pointer submit-btn"
          onClick={(e) => handleSubmit(e)}
        >
          {" "}
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default memo(UserProfile);
