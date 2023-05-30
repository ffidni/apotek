import React, { useContext } from "react";
import { Formik, Field, Form } from "formik";
import { FaStethoscope } from "react-icons/fa";
import { loginSchemas } from "../utils/schemas";
import ErrorText from "../components/ErrorText";
import { addLog, loginAPI } from "../utils/db";
import { Context } from "../components/Context";
import { useRouter } from "next/router";
import { show } from "../utils/toast";

const login = () => {
  const router = useRouter();
  const { user, setUser } = useContext(Context);

  return (
    <div className="main-bg flex items-center justify-center w-screen">
      <div className="card flex flex-col items-center gap-5 justify-center">
        <div className="flex items-center justify-center title">
          <FaStethoscope className="text-4xl" />
          <p className="text-2xl">Apotek XYZ</p>
        </div>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={loginSchemas}
          onSubmit={async (values) => {
            console.log(values);
            const result = await loginAPI(values);
            if (result.status === 200) {
              window.sessionStorage.setItem(
                "user",
                JSON.stringify(result.response)
              );
              setUser(JSON.stringify(result.response));
              addLog({
                aktifitas: "Login",
                id_user: user && user.id_user,
              });
              show("Login berhasil");
              router.replace("/home");
            } else {
              show(result.response, true);
            }
          }}
        >
          {(props) => {
            return (
              <Form className="form flex flex-col">
                <div className="row">
                  <p className="input-text">Username</p>
                  <Field
                    name="username"
                    type="input"
                    className="input border-2"
                  />
                  <ErrorText
                    error={props.touched.username && props.errors.username}
                  />
                </div>
                <div className="row">
                  <p className="input-text">Password</p>
                  <Field
                    name="password"
                    type="password"
                    className="input border-2"
                  />
                  <ErrorText
                    error={props.touched.password && props.errors.password}
                  />
                </div>
                <a
                  className="btn text-center rounded-md mt-8"
                  onClick={props.handleSubmit}
                >
                  Login
                </a>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default login;
