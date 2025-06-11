import React, { useState } from "react";
import {
  Navbar as ReactstrapNavbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <ReactstrapNavbar
        color="dark"
        dark
        expand="md"
        className="px-4 py-2 shadow"
      >
        <NavbarBrand href="/" className="fw-bold text-warning fs-4">
        GECWC
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem>
              <NavLink href="/components/" className="text-light">
                Components
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="https://github.com/reactstrap/reactstrap"
                className="text-light"
              >
                GitHub
              </NavLink>
            </NavItem>

            {/* Options Dropdown */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="text-light">
                Options
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            {/* Login Dropdown */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="text-light">
                Login
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem href="/login">User Login</DropdownItem>
                <DropdownItem href="/admin-login">Admin Login</DropdownItem>
                <DropdownItem href="/warden-login">Warden Login</DropdownItem>
                <DropdownItem href="/mess_manager-login">Mess-manager Login</DropdownItem>
                <DropdownItem href="/hostel-care-tacker-login">Hostel Care Tacker Login</DropdownItem>

                <DropdownItem divider />
                <DropdownItem href="/login/more">More...</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </ReactstrapNavbar>
    </div>
  );
};

export default Navbar;


