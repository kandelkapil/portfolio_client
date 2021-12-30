import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { useEffect, useState } from "react";
import axios from "axios";

import { SharePrice } from "./CurrentPrice";

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
  const [getdata, setgetdata] = useState([]);

  useEffect(() => {
    axios
      .get("https://silly-bardeen-3a48d7.netlify.app/.netlify/functions/api")
      .then((response) => setgetdata(response.data));
  }, []);

  let get_no_unit = getdata.map((data) => data.no_of_units);
  let get_current_share_value = getdata.map((data) => data.price_of_stock);
  let curr_share_value = SharePrice.map((curr) => curr.value);

  let get_total_amount = getdata.map((val) => val.total_amount);

  const market_share_price = curr_share_value.map((dat, index) => {
    return dat * get_no_unit[index];
  });

  const bought_share_price = get_current_share_value.map((dat, index) => {
    return dat * get_no_unit[index];
  });

  const profit_loss = market_share_price.map((data, index) => {
    return data - bought_share_price[index];
  });

  let overall_total_units = 0;
  for (var i = 0; i < get_no_unit.length; i++) {
    overall_total_units += get_no_unit[i];
  }

  let overall_total_investment = 0;
  for (var i = 0; i < get_total_amount.length; i++) {
    overall_total_investment += get_total_amount[i];
  }

  let overall_profit_loss = 0;
  for (var i = 0; i < profit_loss.length; i++) {
    overall_profit_loss += profit_loss[i];
  }

  let overall_current_value = 0;
  for (var i = 0; i < bought_share_price.length; i++) {
    overall_current_value += bought_share_price[i];
  }
  return (
    <React.Fragment>
      <Title>Available Shares</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price Per Unit</TableCell>
            <TableCell>Number of Units</TableCell>
            <TableCell>Total Share Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Transaction Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getdata.map((dat) => (
            <TableRow key={dat._id}>
              <TableCell>{dat.name}</TableCell>
              <TableCell>{dat.price_of_stock}</TableCell>
              <TableCell>{dat.no_of_units}</TableCell>
              <TableCell>Rs {dat.user_value}</TableCell>
              <TableCell>{dat.status}</TableCell>
              <TableCell align="right">
                {new Intl.DateTimeFormat("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                }).format(new Date(dat.transaction_date))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Overall Profit And Loss */}
      <Title>Overall</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Profit/Loss</TableCell>
            <TableCell>Total No Of Units</TableCell>
            <TableCell>Total Investment</TableCell>
            <TableCell>Current Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{overall_profit_loss}</TableCell>
            <TableCell>{overall_total_units}</TableCell>
            <TableCell>{overall_total_investment}</TableCell>
            <TableCell>{overall_current_value}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Title>Profit And Loss</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price Per Units</TableCell>
            <TableCell>No Of Units</TableCell>

            <TableCell>Status</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Profit/Loss</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getdata.map((dat) => (
            <TableRow key={dat._id}>
              <TableCell>{dat.name}</TableCell>
              <TableCell>{dat.price_of_stock}</TableCell>
              <TableCell>{dat.no_of_units}</TableCell>
              <TableCell>{dat.status}</TableCell>
              <TableCell>Rs {dat.user_value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableRow>Total Price Per Unit</TableRow>
            <TableCell>Total No Of Units</TableCell>
            <TableCell>Total Investment</TableCell>
            <TableCell>Current Value</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </React.Fragment>
  );
}
