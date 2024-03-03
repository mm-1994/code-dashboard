import React, {useContext} from "react";
import { CSVLink } from "react-csv";
import { IconButton, Image } from "@chakra-ui/react";
import { ThemeContext } from "../../../context/theme";
import excel from "../../../assets/images/logo/excel.png";

function ExcelExport({ title, data }) {
    const theme = useContext(ThemeContext);
  return (
    <>
      <CSVLink data={data} target="_blank" filename={title + ".csv"}>
        <IconButton
          size={"sm"}
          p={1}
          color={"text.primary"}
          bg={"primary.60"}
          rounded={"full"}
          boxShadow={
            theme.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          <Image position={"relative"} src={excel} h={5}></Image>
        </IconButton>
      </CSVLink>
    </>
  );
}

export default ExcelExport;
