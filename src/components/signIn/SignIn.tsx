"use client";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter(); // Initialize the router

  // Function to handle login success
  const handleLogin = (credentialResponse: any) => {
    console.log("Login Success:", credentialResponse);
    
    // Store the token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("google_token", credentialResponse.credential);
      console.log("Stored Token:", credentialResponse.credential);
    }
    
    // Navigate to home page on success
    router.push("/home");
  };

  // Function to handle login error
  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Sign In</h2>
          <p className="text-gray-500">Please sign in to continue</p>
        </div>
        <div className="flex flex-col items-center">
          {/* GoogleLogin button component */}
          <GoogleLogin
            onSuccess={handleLogin} // Call handleLogin on success
            onError={handleLoginError} // Call handleLoginError on failure
            useOneTap
            theme="outline"
            shape="circle"
            size="large"
          />
        </div>
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">By signing in, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
