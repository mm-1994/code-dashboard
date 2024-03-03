import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RouteGuard from "./helpers/route-guard";
import { getUserInfo, isLoggedIn } from "./api/user";
import MainLayout from "./layouts/main/main";
import Dashboard from "./components/pages/dashboard/dashboard";
import Users from "./components/pages/users/users";
import Login from "./components/pages/authentication/login/login";
import Device from "./components/pages/device/device";
import Reports from "./components/pages/reports/reports";
import CytagPage from "./components/pages/cytag-page/cytag-page";
import DeviceManagement from "./components/pages/device-management/device-management";
import { hasPermission } from "./helpers/permissions-helper";
import { PERMISSIONS } from "./types/devices";
import Geofences from "./components/pages/geofences/geofences";
import AlarmsSettings from "./components/pages/alarms-settings/alarms-settings";
import Notifications from "./components/pages/notifications/notifications";
import ScheduledReports from "./components/pages/reports/scheduled-reports/scheduled-reports";
import RoutesPage from "./components/pages/routes-page/routes-page";
import CreateRolePage from "./components/pages/roles/create-role/create-role";
import EditRolePage from "./components/pages/roles/edit-role/edit-role";
import ViewRoles from "./components/pages/roles/roles";
import ViewDeviceGroups from "./components/pages/device groups/device-groups";
import EditDeviceGroup from "./components/pages/device groups/edit-device-groups/edit-device-groups";
import CreateDeviceGroup from "./components/pages/device groups/create-device-groups/create-device-groups";
import ChangePassword from "./components/pages/change-password/change-password";
import GenerateOtp from "./components/pages/generate-otp/generate-otp";
import Profile from "./components/pages/profile/profile";
import VerifyEmail from "./components/pages/verify-email/verify-email";
import Ticketing from "./components/pages/ticketing/ticketing";
import TicketPage from "./components/pages/ticketing/ticket-page/ticket-page";
import BillingPage from "./components/pages/billing-system/billing-system";

function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            element={
              <RouteGuard condition={isLoggedIn()} redirect={"/login"} />
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/device/:containerId/:Id/:identifier"
              element={<Device />}
            />
            <Route
              path="/device/Cytag/:Id/:identifier"
              element={<CytagPage />}
            />
            <Route
              element={
                <RouteGuard
                  condition={hasPermission(PERMISSIONS.GET_USERS)}
                  redirect={"/"}
                />
              }
            >
              <Route path="users" element={<Users />} />
            </Route>
            <Route
              element={
                <RouteGuard
                  condition={hasPermission(PERMISSIONS.GET_GEOFENCES)}
                  redirect={"/"}
                />
              }
            >
              <Route path="geofences" element={<Geofences />} />
            </Route>
            <Route path="routes" element={<RoutesPage />} />
            <Route path="reports" element={<Reports />} />
            <Route path="alarms-settings" element={<AlarmsSettings />} />
            <Route path="notifications" element={<Notifications />} />

            <Route path="devices" element={<DeviceManagement />} />
            <Route path="/scheduled-reports" element={<ScheduledReports />} />
            <Route path="view-roles" element={<ViewRoles />} />
            <Route path="view-device-groups" element={<ViewDeviceGroups />} />
            <Route path="view-roles/create-role" element={<CreateRolePage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="billing" element={<BillingPage />} />
            
            <Route
              path="view-device-groups/create-device-group"
              element={<CreateDeviceGroup />}
            />
            <Route
              path="view-roles/edit-role/:id/:name"
              element={<EditRolePage />}
            />
            <Route
              path="view-device-groups/edit-device-group/:id/:name"
              element={<EditDeviceGroup />}
            />
            <Route
              path="user/change-password"
              element={<ChangePassword user={getUserInfo()} />}
            />
            <Route path="support" element={<Ticketing />} />
            <Route path="support/:ticketId" element={<TicketPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route
            path="/reset-password"
            element={<ChangePassword user={getUserInfo()} reset={true} />}
          />
          <Route path="/forget-password" element={<GenerateOtp />} />
          <Route path="/verify-email/:otp" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default Routers;
