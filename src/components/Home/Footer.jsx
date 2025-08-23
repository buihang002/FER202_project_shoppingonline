import React from 'react';
import { Phone, Mail } from 'lucide-react'; 

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5">
            <div className="container text-center text-md-start">
                <div className="row gy-4">
                    {/* About Section */}
                    <div className="col-md-3">
                        <h6 className="text-uppercase fw-bold mb-4">More about Shopii</h6>
                        <p className="text-white-50 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, assumenda.</p>
                    </div>

                    {/* Contact Section (thay thế cho Shop) */}
                    <div className="col-md-2">
                        <h6 className="text-uppercase fw-bold mb-4">Liên hệ</h6>
                        <ul className="list-unstyled space-y-2">
                            <li className="d-flex align-items-center justify-content-center justify-content-md-start">
                                <Phone size={16} className="me-2 flex-shrink-0" />
                                <a href="tel:0868789JQK" className="nav-link p-0 text-white-50 hover:text-white">0868789JQK</a>
                            </li>
                            <li className="d-flex align-items-center justify-content-center justify-content-md-start">
                                <Mail size={16} className="me-2 flex-shrink-0" />
                                <a href="mailto:abcxyz@gmail.com" className="nav-link p-0 text-white-50 hover:text-white">abcxyz@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div className="col-md-3">
                        <h6 className="text-uppercase fw-bold mb-4">Your account</h6>
                        <ul className="list-unstyled space-y-2">
                            <li><a href="#!" className="nav-link p-0 text-white-50 hover:text-white">Profile</a></li>
                            <li><a href="#!" className="nav-link p-0 text-white-50 hover:text-white">Orders</a></li>
                            <li><a href="#!" className="nav-link p-0 text-white-50 hover:text-white">Addresses</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="col-md-4">
                        <h6 className="text-uppercase fw-bold mb-4">Subscribe</h6>
                        <p className="text-white-50 text-sm">A at pellenetesque et mattis porta enim elementum.</p>
                        <div className="input-group mt-3">
                            <input type="email" className="form-control" placeholder="Insert your email...*" />
                            <button className="btn btn-primary">Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="text-center p-4 mt-4 border-top border-secondary">
                <p className="text-white-50 text-sm mb-0">
                    ©Copyright 2025 | Shopii | Powered by ReactBD.com
                </p>
            </div>
        </footer>
    );
};

export default Footer;
