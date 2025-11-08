import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function PaymentCard({ title, amount, onPay }) {
  return (
    <Card className="app-card">
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography className="text-lg font-bold my-3">₹{amount}</Typography>
        <Button variant="contained" onClick={() => onPay(amount)}>Pay</Button>
      </CardContent>
    </Card>
  );
}
