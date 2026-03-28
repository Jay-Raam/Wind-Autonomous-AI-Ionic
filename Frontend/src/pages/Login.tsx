/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { App, App as CapacitorApp } from "@capacitor/app";
import { useIonAlert, useIonRouter } from "@ionic/react";
import {
  IonButton,
  IonInput,
  IonContent,
  IonPage,
  IonText,
  useIonToast,
} from "@ionic/react";
import axios from "axios";
import { FindNumber } from "../service/Permision";
import { CapacitorHttp } from "@capacitor/core";

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);
  const [otpFromServer, setOtpFromServer] = useState<number>();
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const navigate = useHistory();
  const [showToast] = useIonToast();
  const [FullUserData, setFullUserData] = useState<any>([]);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] =
    useState<boolean>(false);

  const router = useIonRouter();
  // exit the app
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    let listener: any;

    const handleBackButton = () => {
      presentAlert({
        header: "Exit App",
        message: "Are you sure you want to exit the app ?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Yes",
            handler: () => {
              App.exitApp();
            },
          },
        ],
      });
    };

    const setupListener = async () => {
      listener = await CapacitorApp.addListener("backButton", () => {
        if (router.routeInfo.pathname === "/login") {
          handleBackButton();
        }
      });
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!isFormOpen) {
      setResendTimer(30);
      setIsResendDisabled(true);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isFormOpen]);

  const handlePhoneNumberChange = (e: CustomEvent) => {
    setPhoneNumber((e.target as HTMLInputElement).value.trim());
    setPhoneNumberError("");
    setIsOtpButtonDisabled(false);
  };

  const handleOTPChange = (e: CustomEvent) => {
    setOtp((e.target as HTMLInputElement).value.trim());
    setOtpError("");
  };

  const validateForm = (): boolean => {
    let valid = true;
    let phoneError = "";
    let otpError = "";

    if (!phoneNumber.trim()) {
      phoneError = "Phone number is required.";
      valid = false;
    } else if (!/^[0-9]{10}$/.test(phoneNumber.trim())) {
      phoneError = "Please enter a valid 10-digit number.";
      valid = false;
    }

    if (!isFormOpen && !otp.trim()) {
      otpError = "OTP is required.";
      valid = false;
    } else if (
      !isFormOpen &&
      otpFromServer &&
      parseInt(otp) !== otpFromServer
    ) {
      otpError = "Invalid OTP.";
      valid = false;
    }

    setPhoneNumberError(phoneError);
    setOtpError(otpError);

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsOtpButtonDisabled(true);

    console.log("OTP sent to:", phoneNumber);

    try {
      const UserFind = await FindNumber(phoneNumber);
      console.log("User Find:", UserFind);

      if (
        UserFind.data.message !== "No data Found" &&
        UserFind.success === 200
      ) {
        const generatedOtp =
          phoneNumber === "9876543210"
            ? 123456
            : Math.floor(Math.random() * 900000) + 100000;

        console.log("generated Otp", generatedOtp);

        try {
          const url = `https://app.tendigit.in/api/sendtemplate.php?LicenseNumber=62390570079&APIKey=QxjBpmLDoIMduW1YCPsfXnJZe&Contact=91${phoneNumber}&Template=code&Param=${UserFind.data.data[0].Name},${generatedOtp}`;

          const data = await CapacitorHttp.get({ url });

          console.log("OtpSendFront : ", generatedOtp);

          console.log("OTP request successful:", data);

          setOtpFromServer(generatedOtp);
          setIsFormOpen(false);
          setFullUserData(UserFind.data.data[0]);
        } catch (error) {
          console.error("Error response:", error);
          showToast({
            message: "Error:" + error,
            duration: 4000,
            color: "danger",
          });
        }
      } else {
        showToast({
          message: "User not found, Please Register",
          duration: 5000,
          color: "danger",
          buttons: [
            {
              text: "Clear",
              role: "cancel",
              handler: () => {
                setPhoneNumber("");
                setIsOtpButtonDisabled(false);
              },
            },
          ],
        });
        setIsOtpButtonDisabled(false);
      }
    } catch (error) {
      console.log("Error sending OTP:", error);
      showToast({
        message: "Error sending OTP",
        duration: 4000,
        color: "danger",
      });
      setIsOtpButtonDisabled(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (parseInt(otp) === otpFromServer) {
      console.log("OTP submitted:", otp);
      console.log("Full User Data:", FullUserData);
      console.log("Full User Data:", FullUserData.ID);
      console.log("Full User Data:", FullUserData.Name);
      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("auth_provider_Id_sili", phoneNumber);
      localStorage.setItem("userName", FullUserData.Name);
      localStorage.setItem("user_id", FullUserData.ID);
      navigate.push("/home");
    } else {
      setOtpError("Invalid OTP.");
      showToast({ message: "Invalid OTP.", duration: 2000, color: "danger" });
    }
  };

  const handleResendOTP = async () => {
    console.log("Resending OTP...");
    if (phoneNumber == "9876543210") {
      const otp = 123456;
      setOtpFromServer(otp);
    } else {
      const otp = Math.floor(Math.random() * 900000) + 100000;
      console.log("Resend OTP", otp);

      try {
        const data = {
          countryCode: "+91",
          phoneNumber: phoneNumber,
          type: "Template",
          template: {
            name: "cenpilot_otp",
            languageCode: "ta",
            bodyValues: [otp],
            buttonValues: { "0": [otp] },
          },
        };

        console.log("data", data);

        const response = await axios.post(
          "https://api.interakt.ai/v1/public/message/",
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Basic VjRocDZfUGthd3VTNEZ2UjMtN1ZmaDlvSFBzRnAxYWFzVW5XR1NEYU5jQTo=",
            },
          }
        );

        if (response.status) {
          setOtpFromServer(otp);
          console.log("Message sent successfully:", response.data);
        }
      } catch (error) {
        console.error("Error response:", error);
        showToast({
          message: "Error:" + error,
          duration: 4000,
          color: "danger",
        });
      }
    }

    setResendTimer(30);
    setIsResendDisabled(true);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="flex-circle">
          <div className="first-circle"></div>
          <div className="first-circle"></div>
        </div>
        <div className="login-bg">
          <div className="overlap-group">
            {isFormOpen ? (
              <form className="loginform" onSubmit={handleSubmit}>
                <h1>SILI GREEN</h1>
                <p>Sign_in</p>
                <div className="input-field-instance input-field-2">
                  <IonInput
                    value={phoneNumber}
                    onIonInput={handlePhoneNumberChange}
                    placeholder="Enter the Whatapp number"
                    type="tel"
                    label="Whatapp number"
                    labelPlacement="floating"
                    fill="outline"
                    className="input-field"
                    maxlength={10}
                  />
                  {phoneNumberError && (
                    <IonText className="error-login">
                      <p>{phoneNumberError}</p>
                    </IonText>
                  )}
                  <IonButton
                    expand="block"
                    className="btn-otp"
                    type="submit"
                    disabled={isOtpButtonDisabled}
                  >
                    GET OTP
                  </IonButton>
                </div>
              </form>
            ) : (
              <form className="loginform" onSubmit={handleOTPSubmit}>
                <h1>SILI GREEN</h1>
                <p>Sign_in</p>
                <div className="input-field-instance input-field-2">
                  <IonInput
                    value={otp}
                    onIonInput={handleOTPChange}
                    placeholder="Enter the OTP"
                    type="tel"
                    label="OTP"
                    labelPlacement="floating"
                    fill="outline"
                    className="input-field"
                    maxlength={6}
                  />
                  {otpError && (
                    <IonText className="error-login">
                      <p>{otpError}</p>
                    </IonText>
                  )}
                  <IonButton expand="block" className="btn-otp" type="submit">
                    Login
                  </IonButton>
                </div>
                <div className="resend-otp">
                  {isResendDisabled ? (
                    <IonText>
                      Resend OTP in
                      {resendTimer}
                      Resend OTP
                    </IonText>
                  ) : (
                    <IonText onClick={handleResendOTP}>Resend OTP</IonText>
                  )}
                </div>
              </form>
            )}
            {/* <Link to="/register" className="login-account">
              <span className="span">
                {
                  translations[language as keyof Translations]
                    .I_dont_have_Account
                }
              </span>
            </Link> */}
          </div>
        </div>
        <div className="flex-circle">
          <div className="first-circle"></div>
          <div className="first-circle"></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
