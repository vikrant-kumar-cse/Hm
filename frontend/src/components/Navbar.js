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
  DropdownItem,
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
        className="px-4 py-3 shadow-lg"
      >
        <NavbarBrand href="/" className="fw-bold text-warning fs-3">
          GECWC Hostel
        </NavbarBrand>
        <NavbarToggler onClick={toggle} className="border-0" />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto align-items-center gap-3" navbar>
            <NavItem>
              <NavLink href="/" className="text-light">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/about" className="text-light">
                About
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/contact" className="text-light">
                Contact
              </NavLink>
            </NavItem>

            {/* Notices Dropdown */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="text-light">
                Notices
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem href="/notices/allotment">
                  Hostel Allotment
                </DropdownItem>
                <DropdownItem href="/notices/mess">
                  Mess Info
                </DropdownItem>
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
                <DropdownItem href="/mess_manager-login">Mess Manager</DropdownItem>
                <DropdownItem href="/hostel-care-tacker-login">Care Taker</DropdownItem>
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
