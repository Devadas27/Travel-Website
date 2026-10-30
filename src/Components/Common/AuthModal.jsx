import { useState, useEffect } from "react";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowPassword(false);
      setErrorMsg("");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
      });
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMsg("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (mode === "login") {
        const response = await fetch(
          "http://localhost:5000/api/user-registration/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Invalid email or password");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onClose();
        window.location.reload();
      } else {
        const response = await fetch(
          "http://localhost:5000/api/user-registration/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.fullName,
              email: formData.email,
              mobileNumber: Number(formData.phone),
              password: formData.password,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        alert(
          `Account created successfully for ${data.user.name}! Please login.`,
        );
        setMode("login");
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 my-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition flex items-center justify-center text-lg focus:outline-none cursor-pointer"
        >
          <FiX />
        </button>

        <div
          className="flex flex-col items-center text-center mb-5"
          style={{ marginTop: "10px" }}
        >
          <h3 className="text-2xl sm:text-3xl font-black text-[#1e2329] tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h3>
          <p
            style={{ marginTop: "10px" }}
            className="text-gray-500 text-xs sm:text-sm mt-1 max-w-sm"
          >
            {isLogin
              ? "Sign in to access your bookings & curated dream tours"
              : "Sign up today and start exploring your next adventure"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs sm:text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <div
          className="flex p-1 bg-gray-100 rounded-2xl mb-6"
          style={{ marginTop: "20px" }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg("");
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              !isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form
          style={{ marginTop: "20px" }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {!isLogin && (
            <div>
              <label
                style={{ padding: "10px 10px" }}
                className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <input
                style={{ padding: "5px 5px" }}
                style={{ padding: "5px 5px" }}
                type="text"
                name="fullName"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#14b8a6] focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/20 transition"
              />
            </div>
          )}

          <div>
            <label
              style={{ padding: "10px 10px" }}
              className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Email Address
            </label>
            <input
              style={{ padding: "5px 5px" }}
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#14b8a6] focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/20 transition"
            />
          </div>

          {!isLogin && (
            <div>
              <label
                style={{ padding: "10px 10px" }}
                className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Phone Number
              </label>
              <input
                style={{ padding: "5px 5px" }}
                type="tel"
                name="phone"
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#14b8a6] focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/20 transition"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                style={{ padding: "10px 10px" }}
                className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                style={{ padding: "5px 5px" }}
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder={
                  isLogin ? "Enter your password" : "Create strong password"
                }
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#14b8a6] focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 text-lg focus:outline-none cursor-pointer"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{ marginTop: "20px" }}
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-[#14b8a6] hover:bg-[#0da291] disabled:opacity-70 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center cursor-pointer tracking-wide"
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <div  style={{marginBottom:'10px'}} className="mt-5 text-center text-xs sm:text-sm text-gray-500">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button
                style={{ marginTop: "10px" }}
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                }}
                className="font-bold text-[#14b8a6] hover:underline focus:outline-none ml-1 cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p style={{marginTop:'10px'}}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                }}
                className="font-bold text-[#14b8a6] hover:underline focus:outline-none ml-1 cursor-pointer"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
