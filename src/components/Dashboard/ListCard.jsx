import React from "react";
import { Link } from "react-router-dom";

const ListCard = ({
  totalOffers,
  OfferAmount,
  totalInvoices,
  totalProformaInvoices,
  ProformaInvoiceAmount,
  InvoiceAmount,
  totalUnpaidInvoices,
  UnpaidInvoiceAmount,
  products,
}) => {
  return (
    <div className="p-4 bg-white my-5 rounded-lg shadow-lg">
      <ul>
        <Link to="offers">
          <li className="flex justify-between py-3 border-b">
            <span className="font-bold"> Total Offers:</span>
            <span className="text-green-600 font-semibold">{totalOffers}</span>
          </li>
          <li className="flex justify-between py-3 border-b">
            <span className="font-bold">Offers:</span>
            <span className="text-green-600 font-semibold">
              Rs. {OfferAmount}
            </span>
          </li>
        </Link>

        <Link to="proforma-invoices">
          <li className="flex justify-between py-3 border-b">
            <span className="font-bold"> Total Proforma Invoices:</span>
            <span className="text-red-600 font-semibold">
              {" "}
              {totalProformaInvoices}
            </span>
          </li>
          <li className="flex justify-between py-3 border-b">
            <span className="font-bold"> Proforma Invoices:</span>
            <span className="text-red-600 font-semibold">
              Rs. {ProformaInvoiceAmount}
            </span>
          </li>
        </Link>

        <Link to="invoices">
          <li className="flex justify-between py-3 border-b">
            <span className="font-bold">Total Invoices:</span>
            <span className="text-blue-600 font-semibold">{totalInvoices}</span>
          </li>
          <li className="flex justify-between py-3 border-b">
            <span className="font-bold">Invoices:</span>
            <span className="text-blue-600 font-semibold">
              Rs. {InvoiceAmount}
            </span>
          </li>

          <li className="flex justify-between py-3 border-b">
            <span className="font-bold">Total Unpaid Invoices:</span>
            <span className="text-purple-600 font-semibold">
              {totalUnpaidInvoices}
            </span>
          </li>
          <li className="flex justify-between py-3 border-b">
            <span className="font-bold">Unpaid Invoices:</span>
            <span className="text-purple-600 font-semibold">
              Rs. {UnpaidInvoiceAmount}
            </span>
          </li>
        </Link>

        <Link to="products">
          <li className="flex justify-between py-3 border-b">
            <span className="font-bold">Total Products:</span>
            <span className="text-blue-600 font-semibold">{products}</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default ListCard;
