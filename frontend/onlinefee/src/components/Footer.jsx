import React from "react";
import { Link } from "react-router-dom";
import { Typography, Container, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyCheckAlt,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faShieldAlt,
  faFileContract,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-20">
      <Container maxWidth="lg" className="py-12">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                  <FontAwesomeIcon icon={faMoneyCheckAlt} className="text-2xl" />
                </div>
                <div>
                  <Typography variant="h6" className="!font-bold">OFPRS</Typography>
                  <Typography variant="caption">Online Fee Payment</Typography>
                </div>
              </div>
              <Typography variant="body2" className="!text-gray-300 !mb-4">
                Secure and instant online fee payment system for students. 
                Pay your fees anytime, anywhere with complete transparency and instant receipts.
              </Typography>
            </motion.div>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h6" className="!font-bold !mb-4">Quick Links</Typography>
              <div className="space-y-2">
                <Link to="/dashboard" className="block text-gray-300 hover:text-white transition-colors no-underline">
                  <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                  Dashboard
                </Link>
                <Link to="/pay" className="block text-gray-300 hover:text-white transition-colors no-underline">
                  <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-2" />
                  Pay Fees
                </Link>
                <Link to="/transactions" className="block text-gray-300 hover:text-white transition-colors no-underline">
                  <FontAwesomeIcon icon={faFileContract} className="mr-2" />
                  Transaction History
                </Link>
                <Link to="/receipts" className="block text-gray-300 hover:text-white transition-colors no-underline">
                  <FontAwesomeIcon icon={faFileContract} className="mr-2" />
                  Receipts
                </Link>
              </div>
            </motion.div>
          </Grid>

          {/* Contact & Policies */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Typography variant="h6" className="!font-bold !mb-4">Contact & Policies</Typography>
              <div className="space-y-2 !text-gray-300">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <Typography variant="body2">support@ofprs.edu</Typography>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} />
                  <Typography variant="body2">+91 1800-XXX-XXXX</Typography>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <Typography variant="body2">India</Typography>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Link to="/privacy-policy" className="block text-gray-300 hover:text-white transition-colors no-underline mb-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="block text-gray-300 hover:text-white transition-colors no-underline mb-2">
                    <FontAwesomeIcon icon={faFileContract} className="mr-2" />
                    Terms & Conditions
                  </Link>
                  <Link to="/faq" className="block text-gray-300 hover:text-white transition-colors no-underline">
                    <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                    FAQ
                  </Link>
                </div>
              </div>
            </motion.div>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Typography variant="body2" className="!text-gray-400">
              © {new Date().getFullYear()} OFPRS. All rights reserved. | Powered by Razorpay
            </Typography>
            <div className="flex gap-4">
              <Typography variant="caption" className="!text-gray-400">
                🔒 Secure Payment Gateway
              </Typography>
              <Typography variant="caption" className="!text-gray-400">
                ⚡ Instant Receipts
              </Typography>
              <Typography variant="caption" className="!text-gray-400">
                📱 24/7 Support
              </Typography>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
