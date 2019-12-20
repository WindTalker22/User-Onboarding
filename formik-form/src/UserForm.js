import React, { useState, useEffect } from "react"
import { withFormik, Form, Field } from "formik"
import * as Yup from "yup"
import axios from "axios"
import "./index.css"
import { Button } from "reactstrap"

const UserForm = ({ values, errors, touched, status }) => {
  const [newUser, setNewUser] = useState([])

  useEffect(() => {
    console.log("status has changed", status)
    status && setNewUser(users => [...users, status])
  }, [status])
  return (
    <div className="user-form">
      <Form>
        <div className="name-div">
          <label htmlFor="name">Name:</label>

          <Field id="name" type="text" name="name" />
          {touched.name && errors.name && (
            <p className="errors">{errors.name}</p>
          )}
        </div>
        <div className="email-div">
          <label htmlFor="email">E-email:</label>

          <Field id="email" type="text" name="email" />
          {touched.email && errors.email && (
            <p className="errors">{errors.email}</p>
          )}
        </div>
        <div className="pword-div">
          <label htmlFor="password">Password:</label>

          <Field id="password" type="password" name="password" />
          {touched.password && errors.password && (
            <p className="errors">{errors.password}</p>
          )}
        </div>
        <div className="drop-div">
          <Field
            className="role-drop"
            as="select"
            name="role"
            type="dropdownlist"
          >
            <option value="role">Select a Role</option>
            <option value="full-stack">Full Stack</option>
            <option value="front-end">Front end</option>
            <option value="back-end">Back end</option>
            <option value="ux/ui">UX/UI</option>
          </Field>
          {touched.role && errors.role && (
            <p className="errors">{errors.role}</p>
          )}
        </div>
        <div className="terms-div">
          <label htmlFor="terms" className="checkbox-container">
            Terms Of Service
            <Field
              id="terms"
              type="checkbox"
              name="terms"
              checked={values.terms}
            />
            {touched.terms && errors.terms && (
              <p className="errors">{errors.terms}</p>
            )}
            <span className="checkmark" />
          </label>
        </div>
        <div className="butt-div">
          <Button color="danger" type="submit">
            Submit!
          </Button>
        </div>
      </Form>
      {newUser.map(user => (
        <div key={user.id}>
          <li>Name: {user.name}</li>
          <li>E-mail: {user.email}</li>
          <li>Password: {user.password}</li>
          <li>Role: {user.role}</li>
        </div>
      ))}
    </div>
  )
}

const FormikUserForm = withFormik({
  mapPropsToValues({ name, email, terms, role, password }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      terms: terms || false,
      role: role || ""
    }
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .min(2, "Must Be More Than Two Characters Long")
      .required("Name Is Required"),
    email: Yup.string()
      .min(2, "Must Be More Than Two Characters Long")
      .email("Invalid Email")
      .required("Email Is Required"),
    password: Yup.string()
      .min(2, "Must Be More Than Two Characters Long")
      .required("Password Is Required"),
    terms: Yup.boolean().oneOf([true], "Must Agree to Terms of Service")
  }),
  handleSubmit(values, { setStatus, resetForm }) {
    console.log("submitting", values)
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        console.log("success", res)
        setStatus(res.data)
        resetForm()
      })
      .catch(err => console.log(err.response))
  }
})(UserForm)

export default FormikUserForm
