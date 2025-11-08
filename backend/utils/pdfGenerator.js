import PDFDocument from "pdfkit";

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
 * Generate professional fee receipt PDF as buffer
 * Returns a Promise that resolves to a Buffer
 */
export const generateReceiptPDF = (transaction) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];

      // Collect PDF data
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ==================== HEADER SECTION ====================
      
      // College Name - RED COLOR
      doc.fontSize(22).fillColor('#DC143C').font('Helvetica-Bold');
      doc.text("VIGNAN'S", 70, 40);
      
      doc.fontSize(11).fillColor('#000000').font('Helvetica');
      doc.text("Foundation for Science, Technology & Research", 70, 65);
      
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text("(Deemed to be University)", 70, 80);
      
      doc.fontSize(9).font('Helvetica');
      doc.text("-Estd. u/s 3 of UGC Act 1956", 70, 95);

      // ==================== RECEIPT TITLE ====================
      
      doc.moveTo(50, 120).lineTo(550, 120).lineWidth(2).stroke();
      
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000');
      doc.text("FEE PAYMENT RECEIPT", 0, 130, { align: 'center' });
      
      doc.moveTo(50, 150).lineTo(550, 150).lineWidth(2).stroke();
      
      // Receipt Number and Date
      const receiptNo = `RCPT/${new Date().getFullYear()}/${transaction._id?.toString().substring(0, 8).toUpperCase() || 'XXXXXXXX'}`;
      const receiptDate = new Date(transaction.createdAt).toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
      
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text(`Receipt No: ${receiptNo}`, 50, 165);
      doc.text(`Date: ${receiptDate}`, 400, 165);

      // ==================== STUDENT DETAILS ====================
      
      let yPos = 200;
      
      doc.rect(50, yPos, 500, 100).lineWidth(0.5).stroke();
      
      yPos += 15;
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text("STUDENT DETAILS", 60, yPos);
      
      yPos += 20;
      doc.fontSize(10).font('Helvetica');
      
      const studentDetails = [
        ["Name of the Student", ":", transaction.name || "N/A"],
        ["Registration No.", ":", transaction.regno || "N/A"],
        ["Email Address", ":", transaction.email || "N/A"],
        ["Mobile Number", ":", transaction.phone || "N/A"],
      ];
      
      studentDetails.forEach(([label, colon, value]) => {
        doc.font('Helvetica-Bold').text(label, 60, yPos);
        doc.text(colon, 200, yPos);
        doc.font('Helvetica').text(value, 210, yPos);
        yPos += 18;
      });

      // ==================== FEE DETAILS ====================
      
      yPos += 20;
      
      doc.rect(50, yPos, 500, 110).lineWidth(0.5).stroke();
      
      yPos += 15;
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text("FEE DETAILS", 60, yPos);
      
      yPos += 20;
      doc.fontSize(10).font('Helvetica');
      
      const feeDetails = [
        ["Fee Category", ":", transaction.feeType || "Tuition Fee"],
        ["Course/Branch", ":", transaction.branch || "B.Tech - CSE"],
        ["Academic Year", ":", transaction.year || "N/A"],
        ["Semester", ":", transaction.semester || "N/A"],
        ["Fee Amount", ":", `₹ ${transaction.amount.toLocaleString()}`],
      ];
      
      feeDetails.forEach(([label, colon, value]) => {
        doc.font('Helvetica-Bold').text(label, 60, yPos);
        doc.text(colon, 200, yPos);
        doc.font('Helvetica').text(value, 210, yPos);
        yPos += 18;
      });

      // ==================== PAYMENT TRANSACTION DETAILS ====================
      
      yPos += 20;
      
      doc.rect(50, yPos, 500, 120).lineWidth(0.5).stroke();
      
      yPos += 15;
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text("PAYMENT TRANSACTION DETAILS", 60, yPos);
      
      yPos += 20;
      doc.fontSize(10).font('Helvetica');
      
      const paymentDetails = [
        ["Payment ID", ":", transaction.paymentId || "N/A"],
        ["Order ID", ":", transaction.orderId?.substring(0, 25) || "N/A"],
        ["Payment Gateway", ":", "Razorpay (Online)"],
        ["Payment Method", ":", transaction.paymentMethod || "Card/UPI/NetBanking"],
        ["Transaction Date", ":", new Date(transaction.createdAt).toLocaleString('en-IN')],
        ["Status", ":", transaction.status.toUpperCase()],
      ];
      
      paymentDetails.forEach(([label, colon, value]) => {
        doc.font('Helvetica-Bold').text(label, 60, yPos);
        doc.text(colon, 200, yPos);
        doc.font('Helvetica').text(value, 210, yPos);
        yPos += 18;
      });

      // ==================== TOTAL AMOUNT PAID ====================
      
      yPos += 20;
      
      // Highlighted box
      doc.rect(50, yPos, 500, 50).fillAndStroke('#FFFACD', '#000000');
      
      yPos += 20;
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000');
      doc.text("TOTAL AMOUNT PAID", 60, yPos);
      
      doc.fontSize(18).fillColor('#DC143C');
      doc.text(`₹ ${transaction.amount.toLocaleString()}`, 450, yPos, { width: 90, align: 'right' });
      
      yPos += 20;
      doc.fontSize(9).font('Helvetica-Oblique').fillColor('#000000');
      const amountInWords = numberToWords(transaction.amount);
      doc.text(`(Rupees ${amountInWords} Only)`, 60, yPos);

      // ==================== BANK DETAILS ====================
      
      yPos += 30;
      
      doc.rect(50, yPos, 500, 70).lineWidth(0.5).stroke();
      
      yPos += 15;
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text("BANK DETAILS", 60, yPos);
      
      yPos += 20;
      doc.fontSize(10).font('Helvetica');
      
      const bankDetails = [
        ["Bank Name", ":", "PUNJAB NATIONAL BANK"],
        ["Branch", ":", "Guntur"],
        ["Account Type", ":", "VFSTR - General Funds"],
      ];
      
      bankDetails.forEach(([label, colon, value]) => {
        doc.font('Helvetica-Bold').text(label, 60, yPos);
        doc.text(colon, 200, yPos);
        doc.font('Helvetica').text(value, 210, yPos);
        yPos += 15;
      });

      // ==================== STATUS STAMP ====================
      
      if (transaction.status === "paid") {
        yPos += 10;
        doc.rect(50, yPos, 100, 30).lineWidth(2).strokeColor('#008000').stroke();
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#008000');
        doc.text("✓ PAID", 75, yPos + 10);
      }

      // ==================== FOOTER ====================
      
      doc.fontSize(8).font('Helvetica-Oblique').fillColor('#505050');
      doc.text("This is a computer-generated receipt and does not require a physical signature.", 0, 720, { align: 'center' });
      doc.text("For any queries, please contact: accounts@vignan.ac.in | Phone: +91-863-2344700", 0, 735, { align: 'center' });
      
      doc.fontSize(7).font('Helvetica-Bold');
      doc.text(`Receipt Generated on: ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}`, 0, 750, { align: 'center' });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
