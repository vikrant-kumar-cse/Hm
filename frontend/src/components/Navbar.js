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

const Navbar = ({ scrollToSection, refs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <ReactstrapNavbar
        color="dark"
        dark
        expand="md"
        className="px-4 py-3 shadow-lg sticky-top"
      >
        <NavbarBrand
          style={{ cursor: "pointer" }}
          className="fw-bold text-warning fs-3"
        >
          <img src="/Collegelogo.png"  alt="Hostel Logo" style={{
      maxHeight: "50px",     // Bigger size, adjust this as needed
      marginRight: 10,
      borderRadius: 10

    }}
  />
        </NavbarBrand>

        <NavbarToggler onClick={toggle} className="border-0" />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto align-items-center gap-3" navbar>

            <NavItem>
              <NavLink
                onClick={() => scrollToSection(refs.aboutRef)}
                style={{ cursor: "pointer" }}
                className="text-light"
              >
                About
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                onClick={() => scrollToSection(refs.contactRef)}
                style={{ cursor: "pointer" }}
                className="text-light"
              >
                Contact
              </NavLink>
            </NavItem>

            {/* Notices */}
            <NavItem>
              <NavLink
                onClick={() => scrollToSection(refs.noticeRef)}
                style={{ cursor: "pointer" }}
                className="text-light"
              >
                Notice
              </NavLink>
            </NavItem>

            {/* Faclities */}
            <NavItem>
              <NavLink
                onClick={() => scrollToSection(refs.facilitiesRef)}
                style={{ cursor: "pointer" }}
                className="text-light"
              >
                Facilities
              </NavLink>
            </NavItem>

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
