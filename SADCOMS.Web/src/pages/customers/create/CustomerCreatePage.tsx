import { Link } from "react-router-dom";
import CustomerCreateForm from "../../../components/customers/CustomerCreateForm";


export default function CustomerCreatePage() {
  
  return (
    <div className="container">
      <Link to="/customers">← Back to Customers</Link>
      <h1>New Customer</h1>
      <CustomerCreateForm/>
    </div>
  )
}
