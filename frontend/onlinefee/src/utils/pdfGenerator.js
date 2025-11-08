import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Convert number to words (Indian numbering system)
 */
const numberToWords = (num) => {
  if (num === 0) return "Zero";
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  
  const convertLessThanThousand = (n) => {
    if (n === 0) return "";
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "");
  };
  
  if (num < 1000) return convertLessThanThousand(num);
  if (num < 100000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return convertLessThanThousand(thousands) + " Thousand" + (remainder !== 0 ? " " + convertLessThanThousand(remainder) : "");
  }
  if (num < 10000000) {
    const lakhs = Math.floor(num / 100000);
    const remainder = num % 100000;
    return convertLessThanThousand(lakhs) + " Lakh" + (remainder !== 0 ? " " + numberToWords(remainder) : "");
  }
  
  const crores = Math.floor(num / 10000000);
  const remainder = num % 10000000;
  return convertLessThanThousand(crores) + " Crore" + (remainder !== 0 ? " " + numberToWords(remainder) : "");
};

/**
 * Generate a professional college fee receipt PDF
 * Matches official college receipt format with all required details
 */
export const generateReceiptPDF = (transaction) => {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [0, 0, 0]; // Black for text
  const headerColor = [41, 98, 255]; // Blue for header
  const borderColor = [0, 0, 0]; // Black borders
  const lightGray = [240, 240, 240]; // Light background
  
  // ==================== HEADER SECTION ====================
  
  // Add Vignan's Logo (Base64 embedded)
  const vignanLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABkCAYAAAA8AQ3AAAAAXNSRw..."; // Logo will be added
  
  try {
    // Add logo image at top left
    doc.addImage(vignanLogo, 'PNG', 15, 10, 45, 35);
  } catch (error) {
    // Fallback: Draw logo box if image fails
    doc.setDrawColor(41, 98, 255);
    doc.setLineWidth(2);
    doc.rect(15, 10, 45, 35);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 98, 255);
    doc.text("VIGNAN'S", 37.5, 25, { align: "center" });
    doc.text("LOGO", 37.5, 32, { align: "center" });
  }
  
  // College Name (Right side of logo) - RED COLOR
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 20, 60); // Red color
  doc.text("VIGNAN'S", 70, 18);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("Foundation for Science, Technology & Research", 70, 26);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("(Deemed to be University)", 70, 33);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("-Estd. u/s 3 of UGC Act 1956", 70, 40);
  
  // ==================== RECEIPT TITLE ====================
  
  doc.setLineWidth(2);
  doc.setDrawColor(0, 0, 0);
  doc.line(15, 52, 195, 52);
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("FEE PAYMENT RECEIPT", 105, 60, { align: "center" });
  
  doc.setLineWidth(2);
  doc.line(15, 65, 195, 65);
  
  // Receipt Number and Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const receiptNo = `RCPT/${new Date().getFullYear()}/${transaction._id?.substring(0, 8).toUpperCase() || 'XXXXXXXX'}`;
  const receiptDate = new Date(transaction.createdAt).toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  doc.text(`Receipt No: ${receiptNo}`, 15, 73);
  doc.text(`Date: ${receiptDate}`, 150, 73);
  
  // ==================== STUDENT DETAILS ====================
  
  let yPos = 82;
  
  // Student Details Box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos, 180, 45);
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("STUDENT DETAILS", 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Create a clean table format
  const studentDetails = [
    ["Name of the Student", ":", transaction.name || "N/A"],
    ["Registration No.", ":", transaction.regno || "N/A"],
    ["Email Address", ":", transaction.email || "N/A"],
    ["Mobile Number", ":", transaction.phone || "N/A"],
  ];
  
  studentDetails.forEach(([label, colon, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPos);
    doc.text(colon, 70, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 75, yPos);
    yPos += 7;
  });
  
  // ==================== FEE DETAILS ====================
  
  yPos += 10;
  
  // Fee Details Box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos, 180, 55);
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("FEE DETAILS", 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Get user data from transaction or localStorage
  const userData = transaction.userData || JSON.parse(localStorage.getItem("ofprs_user") || "{}");
  
  // Fee breakdown - fetch from profile
  const feeDetails = [
    ["Fee Category", ":", transaction.feeType || "Tuition Fee"],
    ["Course/Branch", ":", userData.branch || transaction.branch || "B.Tech - CSE"],
    ["Academic Year", ":", userData.year || transaction.year || "N/A"],
    ["Semester", ":", userData.semester || transaction.semester || "N/A"],
    ["Fee Amount", ":", `₹ ${transaction.amount.toLocaleString()}`],
  ];
  
  feeDetails.forEach(([label, colon, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPos);
    doc.text(colon, 70, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 75, yPos);
    yPos += 7;
  });
  
  // ==================== PAYMENT TRANSACTION DETAILS ====================
  
  yPos += 10;
  
  // Payment Details Box
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos, 180, 48);
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("PAYMENT TRANSACTION DETAILS", 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const paymentDetails = [
    ["Payment ID", ":", transaction.paymentId || "N/A"],
    ["Order ID", ":", transaction.orderId?.substring(0, 25) || "N/A"],
    ["Payment Gateway", ":", "Razorpay (Online)"],
    ["Payment Method", ":", transaction.paymentMethod || "Card/UPI/NetBanking"],
    ["Transaction Date", ":", new Date(transaction.createdAt).toLocaleString('en-IN')],
    ["Status", ":", transaction.status.toUpperCase()],
  ];
  
  paymentDetails.forEach(([label, colon, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPos);
    doc.text(colon, 70, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 75, yPos);
    yPos += 7;
  });
  
  // ==================== TOTAL AMOUNT PAID ====================
  
  yPos += 10;
  
  // Highlighted Total Amount Box
  doc.setFillColor(255, 250, 205); // Light yellow background
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(15, yPos, 180, 25, "FD");
  
  yPos += 9;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("TOTAL AMOUNT PAID", 20, yPos);
  
  // Large, bold amount
  doc.setFontSize(18);
  doc.setTextColor(220, 20, 60); // Red color for amount
  doc.text(`₹ ${transaction.amount.toLocaleString()}`, 190, yPos, { align: "right" });
  
  // Amount in words
  yPos += 9;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(0, 0, 0);
  const amountInWords = numberToWords(transaction.amount);
  doc.text(`(Rupees ${amountInWords} Only)`, 20, yPos);
  
  // ==================== BANK DETAILS ====================
  
  yPos += 10;
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos, 180, 28);
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("BANK DETAILS", 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const bankDetails = [
    ["Bank Name", ":", "PUNJAB NATIONAL BANK"],
    ["Branch", ":", "Guntur"],
    ["Account Type", ":", "VFSTR - General Funds"],
  ];
  
  bankDetails.forEach(([label, colon, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPos);
    doc.text(colon, 70, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 75, yPos);
    yPos += 6;
  });
  
  // ==================== STATUS STAMP ====================
  
  if (transaction.status === "paid") {
    yPos += 5;
    
    // PAID stamp
    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(2);
    doc.rect(15, yPos, 50, 15);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 0);
    doc.text("✓ PAID", 40, yPos + 10, { align: "center" });
  }
  
  // ==================== FOOTER ====================
  
  yPos = 270;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(15, yPos, 195, yPos);
  
  yPos += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(80, 80, 80);
  doc.text("This is a computer-generated receipt and does not require a physical signature.", 105, yPos, { align: "center" });
  
  yPos += 5;
  doc.text("For any queries, please contact: accounts@vignan.ac.in | Phone: +91-863-2344700", 105, yPos, { align: "center" });
  
  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text(`Receipt Generated on: ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}`, 105, yPos, { align: "center" });
  
  // Watermark
  doc.setFontSize(70);
  doc.setTextColor(240, 240, 240);
  doc.setFont("helvetica", "bold");
  doc.text("PAID", 105, 160, { align: "center", angle: 45 });
  
  return doc;
};

/**
 * Download receipt as PDF
 */
export const downloadReceipt = (transaction) => {
  // Attach user profile data to transaction
  const userData = JSON.parse(localStorage.getItem("ofprs_user") || "{}");
  const enrichedTransaction = {
    ...transaction,
    userData: userData,
    year: userData.year || transaction.year,
    semester: userData.semester || transaction.semester,
    branch: userData.branch || transaction.branch,
  };
  
  const doc = generateReceiptPDF(enrichedTransaction);
  const fileName = `FeeReceipt_${transaction.regno || 'Student'}_${transaction.paymentId || transaction._id}_${Date.now()}.pdf`;
  doc.save(fileName);
};

/**
 * Open receipt in new tab
 */
export const viewReceipt = (transaction) => {
  // Attach user profile data to transaction
  const userData = JSON.parse(localStorage.getItem("ofprs_user") || "{}");
  const enrichedTransaction = {
    ...transaction,
    userData: userData,
    year: userData.year || transaction.year,
    semester: userData.semester || transaction.semester,
    branch: userData.branch || transaction.branch,
  };
  
  const doc = generateReceiptPDF(enrichedTransaction);
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
};

/**
 * Get receipt as base64 string (for storage or email)
 */
export const getReceiptBase64 = (transaction) => {
  // Attach user profile data to transaction
  const userData = JSON.parse(localStorage.getItem("ofprs_user") || "{}");
  const enrichedTransaction = {
    ...transaction,
    userData: userData,
    year: userData.year || transaction.year,
    semester: userData.semester || transaction.semester,
    branch: userData.branch || transaction.branch,
  };
  
  const doc = generateReceiptPDF(enrichedTransaction);
  return doc.output("dataurlstring");
};

/**
 * Get receipt PDF as buffer (for backend email attachment)
 */
export const getReceiptPDFBuffer = (transaction) => {
  const doc = generateReceiptPDF(transaction);
  return doc.output("arraybuffer");
};
