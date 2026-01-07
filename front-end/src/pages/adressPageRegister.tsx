import TopBar from "../components/topbar";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import Axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useState } from "react";
import "react-country-state-city/dist/react-country-state-city.css";

function AdressRegisterPage() {
  type CountryType = {
    id: number;
    name: string;
    iso2: string;
    iso3?: string;
  };

  type StateType = {
    id: number;
    name: string;
    country_id: number;
  };

  type CityType = {
    id: number;
    name: string;
    state_id: number;
  };

  interface FormValues {
    countryId: number;
    countryName: string;
    stateId: number;
    stateName: string;
    cityId: number;
    cityName: string;
    neighborhood: string;
    street: string;
    number: string;
  }
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [country, setCountry] = useState<CountryType | null>(null);
  const [state, setState] = useState<StateType | null>(null);
  const [city, setCity] = useState<CityType | null>(null);
  const handleEdit = (values: FormValues) => {
    Axios.post("http://localhost:3000/adress-register", values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if ((response.data.message = "Endereço cadastrado com sucesso")) {
          alert("Endereço cadastrado");
        }
        navigate("/adress-user");
      })
      .catch((error) => {
        console.log("erro ao adicionar endereço", error);
      });
  };
  const validateEdit = yup.object({
    countryId: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .required(),
    stateId: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .required(),
    cityId: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .required(),
    neighborhood: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .required(),
    street: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .required(),
    number: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .required(),
  });
  return (
    <section className="adress-register-section">
      <TopBar></TopBar>
      <div className="adress-register-container">
        <header>
          <h2 className="inter">Adicionar novo Endereço</h2>
        </header>

        <Formik
          validationSchema={validateEdit}
          initialValues={{
            countryId: 0,
            countryName: "",
            stateId: 0,
            stateName: "",
            cityId: 0,
            cityName: "",
            neighborhood: "",
            street: "",
            number: "",
          }}
          onSubmit={handleEdit}
        >
          {({ setFieldValue }) => (
            <Form>
              <CountrySelect
                containerClassName="adress-input"
                value={country ? country.id : 0}
                placeHolder="Selecione o país"
                onChange={(value) => {
                  if (value && typeof value === "object" && "id" in value) {
                    setCountry(value as CountryType);
                    setState(null);
                    setCity(null);

                    setFieldValue("countryId", value.id);
                    setFieldValue("countryName", value.name);
                    setFieldValue("stateId", 0);
                    setFieldValue("stateName", "");
                    setFieldValue("cityId", 0);
                    setFieldValue("cityName", "");
                  }
                }}
              />
              <ErrorMessage
                component="span"
                name="country"
                className="error-message"
              ></ErrorMessage>
              <StateSelect
                containerClassName="adress-input"
                countryid={country ? country.id : 0}
                value={state ? state.id : 0}
                placeHolder="Selecione o estado"
                disabled={!country}
                onChange={(value) => {
                  if (value && typeof value === "object" && "id" in value) {
                    setState(value as unknown as StateType);
                    setCity(null);

                    setFieldValue("stateId", value.id);
                    setFieldValue("stateName", value.name);
                    setFieldValue("cityId", 0);
                    setFieldValue("cityName", "");
                  }
                }}
              />
              <ErrorMessage
                component="span"
                name="state"
                className="error-message"
              ></ErrorMessage>
              <CitySelect
                containerClassName="adress-input"
                countryid={country ? country.id : 0}
                stateid={state ? state.id : 0}
                value={city ? city.id : 0}
                placeHolder="Selecione a cidade"
                disabled={!state}
                onChange={(value) => {
                  if (value && typeof value === "object" && "id" in value) {
                    setCity(value as unknown as CityType);

                    setFieldValue("cityId", value.id);
                    setFieldValue("cityName", value.name);
                  }
                }}
              />
              <ErrorMessage
                component="span"
                name="city"
                className="error-message"
              ></ErrorMessage>
              <Field
                name="neighborhood"
                placeholder="Bairro"
                type="text"
              ></Field>
              <ErrorMessage
                component="span"
                name="neighborhood"
                className="error-message"
              ></ErrorMessage>
              <Field name="street" placeholder="Rua" type="text"></Field>
              <ErrorMessage
                component="span"
                name="street"
                className="error-message"
              ></ErrorMessage>
              <Field name="number" placeholder="Número" type="text"></Field>
              <ErrorMessage
                component="span"
                name="number"
                className="error-message"
              ></ErrorMessage>
              <button type="submit" className="adress-register-save-button inter">Salvar</button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}

export default AdressRegisterPage;
