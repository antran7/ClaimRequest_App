import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const navigate = useNavigate();

  const emailSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const codeSchema = Yup.object().shape({
    code: Yup.string().required("Verification code is required"),
  });

  const handleResend = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("https://management-claim-request.vercel.app/api/auth/resend-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) throw new Error("Failed to send verification email");

      toast.success("Verification code sent to your email.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("https://management-claim-request.vercel.app/api/auth/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: values.code }),
      });
  
      if (!response.ok) throw new Error("Invalid verification token");
  
      toast.success("Verification successful!");
      navigate("/login");

    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Verify Your Account
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Enter the verification code sent to your email.
        </p>

        {showEmailInput && (
          <Formik
            initialValues={{ email: "" }}
            validationSchema={emailSchema}
            onSubmit={handleResend}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col">
                <div className="flex items-center bg-gray-100 rounded-md p-2 mb-2 border focus-within:ring-1 focus-within:ring-blue-500">
                  <Field
                    type="email"
                    name="email"
                    className="flex-1 bg-transparent text-gray-800 outline-none"
                    placeholder="Enter your email"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-2 text-blue-600 font-semibold hover:underline"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mb-4"
                />
              </Form>
            )}
          </Formik>
        )}

        <Formik
          initialValues={{ code: "" }}
          validationSchema={codeSchema}
          onSubmit={handleVerify}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col">
              <Field
                type="text"
                name="code"
                className="bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-2 
                  focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 
                  transition ease-in-out duration-150"
                placeholder="Enter verification code"
              />
              <ErrorMessage
                name="code"
                component="div"
                className="text-red-500 text-sm mb-4"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white 
                  font-bold py-2 px-4 rounded-md mt-2 
                  hover:from-indigo-600 hover:to-blue-600 
                  transition ease-in-out duration-150"
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowEmailInput(true)}
            className="text-sm text-gray-600 hover:underline focus:outline-none"
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
