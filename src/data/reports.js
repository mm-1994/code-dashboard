import React, {useContext} from "react";
import { ThemeContext } from "../context/theme";

export function getReportsUiSchema () {

    const theme = useContext(ThemeContext);

    return {
        'ui:submitButtonOptions': {
            submitText: 'Schedule Report',
            norender: false,
            props: {
                disabled: false,
                bg: 'primary.80',
                color: "text.primary",
                _hover: { bg: "primary.60"},
                boxShadow: 
                  theme.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                
            }
        },
        scheduled_at: {
            'ui:type': 'datetime'
        }
    };
}
