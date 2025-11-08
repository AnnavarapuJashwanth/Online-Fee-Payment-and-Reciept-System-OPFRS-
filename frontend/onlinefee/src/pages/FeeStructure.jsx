import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, Tabs, Tab, Box } from "@mui/material";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faHome, faBus } from "@fortawesome/free-solid-svg-icons";
import { feeStructure, hostelFee, transportFee } from "../utils/feeStructure";

export default function FeeStructure() {
  const [activeTab, setActiveTab] = useState(0);
  const [category, setCategory] = useState("Category A");
  const savedUser = JSON.parse(localStorage.getItem("ofprs_user") || "{}");

  useEffect(() => {
    if (savedUser.category) {
      setCategory(savedUser.category);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-2xl mb-4"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="text-white text-4xl" />
            </motion.div>
            <Typography variant="h4" className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Fee Structure 2025-26
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Comprehensive fee details for all programs
            </Typography>
          </div>

          {/* Category Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex gap-2">
              <button
                onClick={() => setCategory("Category A")}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  category === "Category A"
                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Category A
              </button>
              <button
                onClick={() => setCategory("Category B")}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  category === "Category B"
                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Category B
              </button>
            </div>
          </div>

          {/* Tabs */}
          <Box className="mb-6">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              className="!bg-white !rounded-2xl !shadow-lg"
              TabIndicatorProps={{
                style: { background: "linear-gradient(to right, #059669, #2563eb)" },
              }}
            >
              <Tab
                icon={<FontAwesomeIcon icon={faGraduationCap} />}
                label="Tuition Fee"
                className="!font-semibold"
              />
              <Tab
                icon={<FontAwesomeIcon icon={faHome} />}
                label="Hostel Fee"
                className="!font-semibold"
              />
              <Tab
                icon={<FontAwesomeIcon icon={faBus} />}
                label="Transport Fee"
                className="!font-semibold"
              />
            </Tabs>
          </Box>

          {/* Tuition Fee Tab */}
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Object.entries(feeStructure[category]).map(([branch, fees], index) => (
                <motion.div
                  key={branch}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="!rounded-3xl !shadow-xl !border !border-gray-100 hover:!shadow-2xl !transition-all h-full">
                    <CardContent className="!p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="bg-gradient-to-br from-green-600 to-blue-600 p-3 rounded-xl">
                          <FontAwesomeIcon icon={faGraduationCap} className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <Typography variant="body1" className="!font-bold !text-gray-800 !mb-1">
                            {branch}
                          </Typography>
                          <Typography variant="caption" className="!text-gray-500">
                            B.Tech Program
                          </Typography>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                          <Typography variant="body2" className="!text-gray-700">
                            Admission Fee
                          </Typography>
                          <Typography variant="body2" className="!font-bold !text-green-600">
                            ₹{fees.admissionFee.toLocaleString()}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                          <Typography variant="body2" className="!text-gray-700">
                            Per Year
                          </Typography>
                          <Typography variant="body2" className="!font-bold !text-blue-600">
                            ₹{fees.tuitionFeePerYear.toLocaleString()}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                          <Typography variant="body2" className="!text-gray-700">
                            Per Semester
                          </Typography>
                          <Typography variant="body2" className="!font-bold !text-purple-600">
                            ₹{fees.tuitionFeePerSemester.toLocaleString()}
                          </Typography>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                        <Typography variant="caption" className="!text-gray-600 block text-center">
                          4 Years • 8 Semesters
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Hostel Fee Tab */}
          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {Object.entries(hostelFee).map(([type, fees], index) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="!rounded-3xl !shadow-xl !border !border-gray-100 hover:!shadow-2xl !transition-all">
                    <CardContent className="!p-8">
                      <div className="text-center mb-6">
                        <div className="inline-block bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-2xl mb-4">
                          <FontAwesomeIcon icon={faHome} className="text-white text-3xl" />
                        </div>
                        <Typography variant="h5" className="!font-bold !text-gray-800 !mb-2">
                          {type}
                        </Typography>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
                          <Typography variant="body1" className="!text-gray-700">
                            Registration Fee
                          </Typography>
                          <Typography variant="body1" className="!font-bold !text-orange-600">
                            ₹{fees.registrationFee.toLocaleString()}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                          <Typography variant="body1" className="!text-gray-700">
                            Per Year
                          </Typography>
                          <Typography variant="body1" className="!font-bold !text-red-600">
                            ₹{fees.feePerYear.toLocaleString()}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-pink-50 rounded-xl">
                          <Typography variant="body1" className="!text-gray-700">
                            Per Semester
                          </Typography>
                          <Typography variant="body1" className="!font-bold !text-pink-600">
                            ₹{fees.feePerSemester.toLocaleString()}
                          </Typography>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                        <Typography variant="caption" className="!text-gray-600 block text-center">
                          Note: Bed, Laundry extra
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Transport Fee Tab */}
          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {Object.entries(transportFee).map(([distance, fees], index) => (
                <motion.div
                  key={distance}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="!rounded-3xl !shadow-xl !border !border-gray-100 hover:!shadow-2xl !transition-all">
                    <CardContent className="!p-6">
                      <div className="text-center mb-4">
                        <div className="inline-block bg-gradient-to-br from-cyan-600 to-blue-600 p-3 rounded-xl mb-3">
                          <FontAwesomeIcon icon={faBus} className="text-white text-2xl" />
                        </div>
                        <Typography variant="body1" className="!font-bold !text-gray-800">
                          {distance}
                        </Typography>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-cyan-50 rounded-xl text-center">
                          <Typography variant="caption" className="!text-gray-600 block mb-1">
                            Per Year
                          </Typography>
                          <Typography variant="h6" className="!font-bold !text-cyan-600">
                            ₹{fees.feePerYear.toLocaleString()}
                          </Typography>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-center">
                          <Typography variant="caption" className="!text-gray-600 block mb-1">
                            Per Semester
                          </Typography>
                          <Typography variant="h6" className="!font-bold !text-blue-600">
                            ₹{fees.feePerSemester.toLocaleString()}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </div>
  );
}
