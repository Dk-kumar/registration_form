import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import InputField from "../../../Component/Fields";
import { visibilityIcon, visibilityOffIcon } from "../../../Shared/Icons";
import { Values } from "../../../Constants";
import { apiEndPoint  } from "../../../Constants/apiEndPointConstants";
import {
  emailValidator,
  phoneNumberValidator,
  formButtonEnable,
  passwordValidation,
} from "../../../Shared/Validator";
import "./signUpForm.style.css";

import { request } from "../../../Http/request";
import { postOptions } from "../../../Http/apiHeaderConfig";

//Meterial UI components
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText"

const SignUpForm = withRouter(({history, props}) => {

  const handelFields = () => {
    if (window.innerWidth > 776) {
      return {
        Suffix: "",
        Title: "",
      };
    }
  };

  let initialState = {
    ...handelFields(),
    Firstname: "",
    Lastname: "",
    Email: "",
    isEmailChecked: false,
    Username: "",
    CountryCode: "",
    PhoneNumber: "",
    isNumberChecked: false,
    Password: "",
    ConfirmPassword: "",
  };

  let initialValidation = {
    Firstname: false,
    Lastname: false,
    Email: false,
    Phone: false,
    Username: false,
    CountryCode: false,
    Password: false,
    ConfirmPassword: false,
    isPasswordMatch: false,
  };

  let handelShowHide = {
    passwordField: false,
    confirmPasswordField: false,
  };

  let toolTipMessage = {
    emailError: "hidden",
    phoneNumberError: "hidden",
  };

  const [inputValue, setInputValue] = useState(initialState);
  let [isDisabled, setDisabled] = useState(true);
  let [isShowTooltip, setTooltip] = useState(toolTipMessage);
  let [isShowPassword, setShowPassword] = useState(handelShowHide);
  let [validation, setValidation] = useState(initialValidation);

  const {
    Suffix,
    Title,
    Firstname,
    Lastname,
    Email,
    isEmailChecked,
    Username,
    CountryCode,
    PhoneNumber,
    isNumberChecked,
    Password,
    ConfirmPassword,
  } = inputValue;

  const { emailError, phoneNumberError } = isShowTooltip;
  const { passwordField, confirmPasswordField } = isShowPassword;

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "PhoneNumber") {
      if (isNaN(value)) return false;
    }
    debugger
    setInputValue({
      ...inputValue,
      [name]: value,
    });
    console.log(inputValue)
    let showBtn = formButtonEnable(inputValue);
    if (
      showBtn === false &&
      emailError === "hidden" &&
      phoneNumberError === "hidden"
    ) {
      setDisabled(false);
    }
  };

  const handelCheckbox = (e, type) => {
    setInputValue({
      ...inputValue,
      [type]: e.target.checked,
    });
    console.log(inputValue)
  }

  const formValidation = (field) => {
    setValidation({
      ...validation,
      [field]: true,
    });
  }

  const handleValidation = (type) => {
    const { Email, PhoneNumber } = inputValue;
    if (type === Values.Email) {
      if (!emailValidator(Email)) {
        return setTooltip({
          ...isShowTooltip,
          emailError: "visible",
        });
      }
    }

    if (type === Values.PhoneNumber) {
      if (!phoneNumberValidator(PhoneNumber)) {
        return setTooltip({
          ...isShowTooltip,
          phoneNumberError: "visible",
        });
      }
    }
  
    setTooltip({
      ...isShowTooltip,
      emailError: "hidden",
      phoneNumberError: "hidden",
    });
  };

  const handelIcon = (field) => {
    if (field === "password") {
      setShowPassword({
        ...isShowPassword,
        passwordField: !passwordField,
      });
    } else {
      setShowPassword({
        ...isShowPassword,
        confirmPasswordField: !confirmPasswordField,
      });
    }
  };

  const onSubmit = async () => {
    let isPasswordMatch = passwordValidation(inputValue);
    setValidation({
      ...validation,
      isPasswordMatch: isPasswordMatch,
    });

    const obj = {
      suffix: Suffix,
      title: Title,
      firstName: Firstname,
      lastName: Lastname,
      username: Username,
      password: Password,
      confirmPassword: ConfirmPassword,
      emails: [{ emailAddress: Email, isLoginCriteria: isEmailChecked }],
      phones: [
        {
          phoneNumber: PhoneNumber,
          countryCode: CountryCode,
          isLoginCriteria: isNumberChecked,
        },
      ],
    };
    history.push('/signin');
    const result = await request(
      apiEndPoint.signup,
      postOptions(obj),
    );
    console.log(props)

    if (result) { alert('success')}
    

  };

  const formHeader = () => {
    return (
      <div className="header-container">
        <h2>{Values.SignUp}</h2>
        <span className="header-content">
          {Values.SignInLink} <Link to="/signin">{Values.SignIn}</Link>
        </span>
      </div>
    );
  };

  const socialLogin = () => {
    return (
      <div className="socialLogin-container">
        <InputField
          type="button"
          value={Values.GoogleLogin}
          placeholder=""
          className="google-login"
        />
        <InputField
          type="button"
          value={Values.FaceBookLogin}
          placeholder=""
          className="google-login"
        />
        <InputField
          type="button"
          value={Values.GitHubLogin}
          placeholder=""
          className="github-login"
        />
      </div>
    );
  };

  return (
    <>
      <form className="form-container">
        {formHeader()}
        <div className="form-wrapper">
          <div className="form-header">
            <InputField
              type="text"
              value={Suffix}
              label={Values.Suffix}
              name={Values.Suffix}
              className="inputField-header"
              onChange={handleChange}
            />
            <InputField
              type="text"
              value={Title}
              label={Values.Title}
              name={Values.Title}
              className="inputField-header"
              onChange={handleChange}
            />
            <div>
              <InputField
                type="text"
                value={Firstname}
                label={Values.FirstName}
                name={Values.FirstName}
                className="inputField-header"
                onChange={handleChange}
                required={true}
                border={validation.Firstname && Firstname === "" ? true : false}
                onBlur={() => formValidation(Values.FirstName)}
              />
              <div className="error-message">
                {Firstname === "" && validation.Firstname && (
                  <span>{Values.FirstNameError}</span>
                )}
              </div>
            </div>
            <div>
              <InputField
                type="text"
                value={Lastname}
                label={Values.LastName}
                name={Values.LastName}
                className="inputField-header"
                onChange={handleChange}
                required={true}
                border={validation.Lastname && Lastname === "" ? true : false}
                onBlur={() => formValidation(Values.LastName)}
              />
              <div className="error-message">
                {Lastname === "" && validation.Lastname && (
                  <span>{Values.LastNameError}</span>
                )}
              </div>
            </div>
          </div>
          <div className="form-body">
            <div className="email-wrapper">
              <div className="email-checkbox">
                <InputField
                  type="email"
                  value={Email}
                  label={Values.Email}
                  name={Values.Email}
                  className="inputField-body"
                  required={true}
                  onChange={handleChange}
                  border={emailError === "visible" ? true : false}
                  onBlur={() => handleValidation(Values.Email)}
                />
                <InputField
                  type="checkbox"
                  name={''}
                  checked={isEmailChecked}
                  className="inputField-checkbox"
                  onChange={ (e) => handelCheckbox(e, 'isEmailChecked')}
                />
              </div>
              <div className="error-message">
                {emailError === "visible" && Email !== "" && (
                  <span>{Values.EmailTooltip}</span>
                )}
                {emailError === "visible" && Email === "" && (
                  <span>{Values.EmailError}</span>
                )}
              </div>
              <p className="signUp email-description">
                {Values.EmailPredefinedOption}
              </p>
            </div>
            <div>
              <InputField
                type="text"
                value={Username}
                label={Values.UserName}
                name={Values.UserName}
                className="inputField-body"
                required={true}
                onChange={handleChange}
                border={
                  (validation.Username && Username === "") ||
                  (!(Username.length >= 6) && Username !== "" && validation.Username)
                    ? true
                    : false
                }
                onBlur={() => formValidation(Values.UserName)}
              />
              <div className="error-message">
                {Username === "" && validation.Username && (
                  <span>{Values.UserNameError}</span>
                )}
                {!(Username.length >= 6) &&
                  Username !== "" &&
                  validation.Username && <span>{Values.UserNameMaxError}</span>}
              </div>
            </div>
          </div>
          <div className="form-bottom">
            <div className="code-wrapper">
              <div className="countrycode-wrapper">
                <label className="country-code">Country Code</label>
                <Box
                  sx={{ m: 1, flexBasis: "24%", margin: "1rem 0rem 0rem 0rem" }}
                  size="small"
                >
                  <FormControl fullWidth error={validation.CountryCode && CountryCode === ""}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={CountryCode}
                      label=""
                      name={Values.NameCountryCode}
                      onChange={handleChange}
                      onBlur={() => formValidation("CountryCode")}
                    >
                      <MenuItem value={+1}>+1(USA)</MenuItem>
                      <MenuItem value={+1}>+1(Canada)</MenuItem>
                      <MenuItem value={+52}>+52(Mexico)</MenuItem>
                    </Select>
                    {validation.CountryCode && CountryCode === "" && <FormHelperText>{Values.CountryCodeError}</FormHelperText>}
                  </FormControl>
                </Box>
              </div>
              <div className="phone-wrapper">
                <div className="phone-chekbox">
                  <InputField
                    type="text"
                    value={PhoneNumber}
                    label={Values.PhoneNumber}
                    name={Values.NamePhoneNumber}
                    length="10"
                    required={true}
                    className="inputField-bottom phoneNumberField"
                    onChange={handleChange}
                    border={phoneNumberError === "visible" ? true : false}
                    onBlur={() => handleValidation(Values.PhoneNumber)}
                  />
                  <InputField
                    type="checkbox"
                    checked={isNumberChecked}
                    className="inputField-checkbox"
                    onChange={(e) => handelCheckbox(e, 'isNumberChecked')}
                  />
                </div>
                <div className="error-message">
                  {phoneNumberError === "visible" && PhoneNumber !== "" && (
                    <span>{Values.MobileValidationError}</span>
                  )}
                  {phoneNumberError === "visible" && PhoneNumber === "" && (
                    <span>{Values.PhoneError}</span>
                  )}
                </div>
                <p className="signUp phone-description">
                  {Values.PholePredefinedOption}
                </p>
              </div>
            </div>
            <div className="passwordField">
              <div className="password-wrapper">
                <div className="password-container">
                  <InputField
                    type={passwordField ? "text" : "password"}
                    value={Password}
                    label={Values.Password}
                    name={Values.NamePassword}
                    className="inputField-bottom"
                    required={true}
                    border={
                      validation.Password && Password === "" ? true : false
                    }
                    onChange={handleChange}
                    onBlur={() => formValidation(Values.Password)}
                  />
                  <i
                    onClick={() => handelIcon("password")}
                    className="visibility-icon"
                  >
                    {passwordField ? visibilityOffIcon() : visibilityIcon()}
                  </i>
                </div>
                <div className="error-message">
                  {Password === "" && validation.Password && (
                    <span>{Values.PasswordError}</span>
                  )}
                </div>
              </div>
              <div className="password-wrapper">
                <div className="password-container">
                  <InputField
                    type={confirmPasswordField ? "text" : "password"}
                    value={ConfirmPassword}
                    label={Values.ConfirmPassword}
                    name={Values.NameConfirmPassword}
                    className="inputField-bottom"
                    required={true}
                    border={
                      validation.ConfirmPassword && ConfirmPassword === ""
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    onBlur={() => formValidation("ConfirmPassword")}
                  />
                  <i
                    onClick={() => handelIcon("confirmPassword")}
                    className="visibility-icon"
                  >
                    {confirmPasswordField
                      ? visibilityOffIcon()
                      : visibilityIcon()}
                  </i>
                </div>
                <div className="error-message">
                  {ConfirmPassword === "" && validation.ConfirmPassword && (
                    <span>{Values.ConformPasswordError}</span>
                  )}
                  {validation.isPasswordMatch && ConfirmPassword !== "" && (
                    <span>{Values.IsPasswordMatch}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="btn-submit">
            <button
              type="button"
              disabled={isDisabled}
              className={isDisabled ? "disabled-button" : "form-submit"}
              onClick={onSubmit}
            >
              {Values.CreateAccount}
            </button>
          </div>
          <div className="lines">
            <div className="line-left"></div>
            <span>OR</span>
            <div className="line-right"></div>
          </div>
          {socialLogin()}
        </div>
      </form>
    </>
  );
});

export default SignUpForm;
