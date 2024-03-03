import { createContext, useState } from "react";
import { getCategories } from "../api/ticketing";

const TicketingContext = createContext();

function Ticketingrovider(props) {
  const [categories, setCategories] = useState([]);
  const getCategoriesCall = (pageNum) => {
    return getCategories(pageNum, 10);
  };
  return (
    <div>
      <TicketingContext.Provider
        value={{ categories, setCategories, getCategoriesCall }}
      >
        {props.children}
      </TicketingContext.Provider>
    </div>
  );
}

export { TicketingContext, Ticketingrovider };
