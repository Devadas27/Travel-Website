import React from "react";
import Sidebar from "../Components/Sidebar/Sidebar";

const Dashboard = () => {
  return (
    <div className="d-flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="p-4 bg-light"
        style={{ flex: 1 }}
      >
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            Dashboard
          </h2>

          <p className="text-muted mb-0">
            Welcome back to Wanderly Admin Panel
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="row g-4">

          {/* Tourist Places */}
          <div className="col-md-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#CCFBF1",
                    fontSize: "24px",
                  }}
                >
                  📍
                </div>

                <h3 className="fw-bold mb-1">
                  24
                </h3>

                <p className="text-muted mb-0">
                  Tourist Places
                </p>

              </div>
            </div>
          </div>

          {/* Tourist Packages */}
          <div className="col-md-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#CCFBF1",
                    fontSize: "24px",
                  }}
                >
                  🧳
                </div>

                <h3 className="fw-bold mb-1">
                  12
                </h3>

                <p className="text-muted mb-0">
                  Tourist Packages
                </p>

              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="col-md-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#CCFBF1",
                    fontSize: "24px",
                  }}
                >
                  📅
                </div>

                <h3 className="fw-bold mb-1">
                  86
                </h3>

                <p className="text-muted mb-0">
                  Bookings
                </p>

              </div>
            </div>
          </div>

          {/* Users */}
          <div className="col-md-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#CCFBF1",
                    fontSize: "24px",
                  }}
                >
                  👥
                </div>

                <h3 className="fw-bold mb-1">
                  1,240
                </h3>

                <p className="text-muted mb-0">
                  Users
                </p>

              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;